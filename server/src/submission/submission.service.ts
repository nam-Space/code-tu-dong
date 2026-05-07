import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('judge') private judgeQueue: Queue,
  ) {}

  async create(data: { code: string; language: string; userId: string; problemId: string }) {
    const submission = await this.prisma.submission.create({
      data: {
        ...data,
        status: SubmissionStatus.PENDING,
      },
    });

    await this.judgeQueue.add('judge-job', {
      submissionId: submission.id,
    });

    return submission;
  }

  async findByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: { problem: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: { problem: { select: { title: true } } },
    });
  }

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        problem: { select: { title: true } },
        user: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Show last 1000 submissions
    });
  }

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        submissions: {
          where: { status: SubmissionStatus.ACCEPTED },
          select: { problemId: true },
        },
      },
    });

    return users
      .map((user) => {
        // Calculate distinct solved problems
        const solvedProblemIds = new Set(user.submissions.map(s => s.problemId));
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          solvedCount: solvedProblemIds.size,
        };
      })
      .sort((a, b) => b.solvedCount - a.solvedCount);
  }
}
