import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname } from "path";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateDailyTask = async () => {
  try {
    const tasksPath = path.join(__dirname, "..", "tasks.csv");
    const tasks = fs.readFileSync(tasksPath, "utf-8")
      .split("\n")
      .map((line) => {
        const [date, task] = line.split(",");
        return { date: date.trim(), task: task.trim().replace(/"/g, "") };
      });

    const today = new Date().toISOString().split("T")[0];

    const todayTask = tasks.find((task) => task.date === today);

    if (!todayTask) {
      throw new Error(`No task found for date: ${today}`);
    }

    await prisma.dailyTask.upsert({
      where: { id: 1 },
      update: {
        task: todayTask.task,
      },
      create: {
        id: 1,
        task: todayTask.task,
      },
    });

    console.log(`Task updated for ${today}: ${todayTask.task}`);
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

updateDailyTask();
