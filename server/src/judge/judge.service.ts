import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { SubmissionsGateway } from '../submission/submissions.gateway';

@Processor('judge')
export class JudgeService extends WorkerHost {
  private readonly logger = new Logger(JudgeService.name);
  private lambdaClient: LambdaClient;

  constructor(
    private prisma: PrismaService,
    private submissionsGateway: SubmissionsGateway,
  ) {
    super();
    // Khởi tạo AWS Lambda Client
    this.lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { submissionId } = job.data;
    this.logger.log(`[AWS Lambda] Processing submission ${submissionId}`);

    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { problem: { include: { testCases: true } } },
    });

    if (!submission) return;

    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: { status: SubmissionStatus.RUNNING },
    });
    
    // Phát tín hiệu đang chạy
    this.submissionsGateway.emitSubmissionUpdate(updatedSubmission);

    try {
      // Gửi toàn bộ bài nộp và test cases sang AWS Lambda để chấm 1 lượt
      const payload = {
        code: submission.code,
        language: submission.language,
        testCases: submission.problem.testCases,
        timeLimit: submission.problem.timeLimit,
        memoryLimit: submission.problem.memoryLimit,
      };

      const command = new InvokeCommand({
        FunctionName: "KuOJ-Judge-Function", // Tên hàm bạn đặt trên AWS
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      const response = await this.lambdaClient.send(command);
      
      if (!response.Payload) {
        throw new Error("No payload received from AWS Lambda");
      }

      const resultPayload = JSON.parse(Buffer.from(response.Payload as Uint8Array).toString());

      if (resultPayload.error) {
          throw new Error(resultPayload.error);
      }

      const results = resultPayload.results; // Mảng kết quả từ Lambda

      // Xử lý kết quả trả về từ Lambda (giống như logic cũ)
      let overallStatus: SubmissionStatus = SubmissionStatus.ACCEPTED;
      let maxTime = 0;
      let maxMemory = 0;

      if (resultPayload.compileError) {
          overallStatus = SubmissionStatus.COMPILE_ERROR;
          await this.prisma.submission.update({
            where: { id: submissionId },
            data: { status: overallStatus, errorMessage: resultPayload.compileError },
          });
          return;
      }

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const testCase = submission.problem.testCases[i];

        maxTime = Math.max(maxTime, result.time);
        maxMemory = Math.max(maxMemory, result.memory);

        if (result.status !== 'ACCEPTED') {
          overallStatus = result.status as SubmissionStatus;
          break;
        }

        if (result.output.trim() !== testCase.expectedOutput.trim()) {
          overallStatus = SubmissionStatus.WRONG_ANSWER;
          break;
        }
      }

      const finalSubmission = await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: overallStatus,
          executionTime: maxTime,
          memoryUsed: maxMemory,
        },
        include: { problem: { select: { title: true } }, user: { select: { username: true } } },
      });

      this.submissionsGateway.emitSubmissionUpdate(finalSubmission);

    } catch (error) {
      this.logger.error(`Error with AWS Lambda: ${error.message}`);
      const errorSubmission = await this.prisma.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.INTERNAL_ERROR, errorMessage: error.message },
        include: { problem: { select: { title: true } }, user: { select: { username: true } } },
      });
      this.submissionsGateway.emitSubmissionUpdate(errorSubmission);
    }
  }
}
