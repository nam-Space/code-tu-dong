import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { SubmissionsGateway } from './submissions.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'judge',
    }),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, PrismaService, SubmissionsGateway],
  exports: [SubmissionService, SubmissionsGateway],
})
export class SubmissionModule {}
