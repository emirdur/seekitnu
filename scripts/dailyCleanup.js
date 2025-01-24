import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function determineWinner() {
  console.log('Determining the winner for the day...');
  const winningImage = await prisma.image.findFirst({
    orderBy: {
      likes: 'desc',
    },
  });

  if (winningImage) {
    const userId = winningImage.userId;
    await prisma.user.update({
      where: { id: userId },
      data: {
        wins: { increment: 1 },
      },
    });

    console.log(`User ${userId} won with image ID ${winningImage.id}`);
  } else {
    console.log('No images uploaded today.');
  }
}

async function updateRanks() {
  console.log('Updating ranks based on wins...');
  const users = await prisma.user.findMany({
    orderBy: {
      wins: 'desc',
    },
  });

  for (let i = 0; i < users.length; i++) {
    await prisma.user.update({
      where: { id: users[i].id },
      data: { rank: i + 1 },
    });
  }
}

async function deleteAllUploads() {
  await prisma.image.deleteMany();
}

async function runDailyTasks() {
  try {
    await determineWinner();
    await updateRanks();
    await deleteAllUploads();
    console.log('Daily tasks completed successfully.');
  } catch (error) {

  } finally {
    await prisma.$disconnect();
  }
}

runDailyTasks();
