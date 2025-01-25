import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { generateTask } from "../utils/openaiClient";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Updates the daily task in the database
 */
const updateDailyTask = async () => {
  try {
    const generatedTask = await generateTask();

    if (generatedTask) {
      await prisma.dailyTask.upsert({
        where: { id: 1 },
        update: {
          task: generatedTask,
        },
        create: {
          id: 1,
          task: generatedTask,
        },
      });

      console.log(`Task updated for today: ${generatedTask}`);
    } else {
      console.error("Failed to generate task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  } finally {
    await prisma.$disconnect();
  }
};

updateDailyTask();
