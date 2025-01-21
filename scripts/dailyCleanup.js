import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function determineWinner() {
  console.log('Determining the winner for the day...');
  // Find the image with the most likes
  const winningImage = await prisma.image.findFirst({
    orderBy: {
      likes: 'desc',
    },
  });

  if (winningImage) {
    const userId = winningImage.userId;
    // Award a win to the user who uploaded the most liked image
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
  // Fetch all users and sort by number of wins
  const users = await prisma.user.findMany({
    orderBy: {
      wins: 'desc',
    },
  });

  // Update the rank field for each user based on their position
  for (let i = 0; i < users.length; i++) {
    await prisma.user.update({
      where: { id: users[i].id },
      data: { rank: i + 1 },
    });
  }
}

async function deleteAllUploads() {
  console.log('Deleting all uploads...');
  const uploadsDir = path.join(__dirname, "..", "src", "backend", "uploads");
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    fs.unlinkSync(filePath); // Delete the file
  }
  // Delete all images
  await prisma.image.deleteMany();
}

async function runDailyTasks() {
  try {
    await determineWinner(); // First, determine the winner
    await updateRanks(); // Then, update the ranks
    await deleteAllUploads(); // Finally, delete the uploads
    console.log('Daily tasks completed successfully.');
  } catch (error) {
    console.error('Error running daily tasks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runDailyTasks();
