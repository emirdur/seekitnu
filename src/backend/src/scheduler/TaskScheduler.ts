import { generateTask } from "../controllers/OpenAIController";
import cron from "node-cron";
import prisma from "../prisma/prisma";

cron.schedule("0 8 * * *", async () => {
  try {
    const prompt = "Generate a task for today";
    const task = await generateTask(prompt);

    await prisma.task.upsert({
      where: { id: 1 },
      update: { task: task },
      create: { task: task },
    });
  } catch (error) {
    throw new Error("Task couldn't be added to the database correctly");
  }
});
