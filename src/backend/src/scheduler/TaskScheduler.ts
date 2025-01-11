import { generateTask } from "../controllers/OpenAIController";
import cron from "node-cron";
import prisma from "../prisma/prisma";

const testScheduler = async () => {
  try {
    console.log("Testing scheduler...");
    const task = "Test task for the day";

    await prisma.task.upsert({
      where: { id: 1 },
      update: { task },
      create: { task },
    });

    console.log("Test task added to the database:", task);
  } catch (error) {
    console.error("Error during test run:", error);
  }
};

cron.schedule("15 22 * * *", async () => {
  try {
    //const prompt = "Generate a task for today";
    //const task = await generateTask(prompt);

    // const testTask = "Test task for the day";

    // await prisma.task.upsert({
    //   where: { id: 1 },
    //   update: { task: testTask },
    //   create: { task: testTask },
    // });
    testScheduler();
  } catch (error) {
    throw new Error("Task couldn't be added to the database correctly");
  }
});
