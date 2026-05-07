import { Module } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionModule } from '../submission/submission.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'judge',
    }),
    SubmissionModule,
  ],
  providers: [JudgeService, PrismaService],
  exports: [JudgeService],
})
export class JudgeModule {}
