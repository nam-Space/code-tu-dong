import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@oj.com' },
    update: {},
    create: {
      email: 'admin@oj.com',
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create Contest
  const contest = await prisma.contest.create({
    data: {
      title: 'Beginner Coding Challenge 2026',
      description: 'A contest for newcomers to test their basic algorithm knowledge.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      creatorId: admin.id,
    },
  });

  // Create Problem 1
  await prisma.problem.create({
    data: {
      title: 'Hello World',
      description: 'Write a program that prints "Hello World".',
      difficulty: 'Easy',
      contestId: contest.id,
      testCases: {
        create: [
          { input: '', expectedOutput: 'Hello World', isSample: true },
        ],
      },
    },
  });

  // Create Problem 2
  await prisma.problem.create({
    data: {
      title: 'Sum of Two Numbers',
      description: 'Read two integers from standard input and print their sum.\n\nInput:\nTwo space-separated integers a and b.\n\nOutput:\nA single integer representing the sum.',
      difficulty: 'Easy',
      contestId: contest.id,
      testCases: {
        create: [
          { input: '5 7', expectedOutput: '12', isSample: true },
          { input: '10 20', expectedOutput: '30', isSample: false },
        ],
      },
    },
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
