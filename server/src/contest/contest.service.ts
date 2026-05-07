import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContestService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contest.findMany({
      include: { creator: { select: { name: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: { 
        problems: true,
        creator: { select: { name: true, email: true } } 
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  async create(data: any, creatorId: string) {
    return this.prisma.contest.create({
      data: {
        ...data,
        creatorId,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.contest.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contest.delete({
      where: { id },
    });
  }
}
