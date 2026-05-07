import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProblemService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.problem.findMany();
  }

  async findByContest(contestId: string) {
    return this.prisma.problem.findMany({
      where: { contestId },
    });
  }

  async findOne(id: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: { 
        testCases: { where: { isSample: true } } // Only return sample test cases to user
      },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async create(data: any) {
    const { testCases, contestId, ...problemData } = data;
    return this.prisma.problem.create({
      data: {
        ...problemData,
        ...(contestId ? { contest: { connect: { id: contestId } } } : {}),
        testCases: {
          create: testCases,
        },
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { testCases, contestId, ...problemData } = data;

    return this.prisma.$transaction(async (tx) => {
      // If testCases are provided, replace them
      if (testCases) {
        await tx.testCase.deleteMany({ where: { problemId: id } });
      }

      return tx.problem.update({
        where: { id },
        data: {
          ...problemData,
          ...(contestId ? { contest: { connect: { id: contestId } } } : {}),
          ...(testCases ? { testCases: { create: testCases } } : {}),
        },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.problem.delete({
      where: { id },
    });
  }
}
