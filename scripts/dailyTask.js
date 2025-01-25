import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

/**
 * Generates a new task using OpenAI
 * @returns {Promise<string | null>} A new task string or null if there's an error
 */
const generateTask = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a task generator." },
        {
          role: "user",
          content: "Generate a daily picture task for a user. Keep it short.",
        },
      ],
    });

    const task = response.choices[0].message.content;
    return task || null;
  } catch (error) {
    console.error("Error generating task with OpenAI:", error);
    return null;
  }
};

/**
 * Fetches tasks from a CSV file
 * @returns {string | null} Task for today or null if not found
 */
const getTaskFromCSV = () => {
  try {
    const tasksPath = path.join(__dirname, "..", "tasks.csv");
    console.log("Looking for tasks in:", tasksPath);

    const tasks = fs
      .readFileSync(tasksPath, "utf-8")
      .split("\n")
      .map((line) => {
        const [date, task] = line.split(",");
        return { date: date.trim(), task: task.trim().replace(/"/g, "") };
      });

    const today = new Date().toISOString().split("T")[0];
    console.log("Today's date:", today);

    const todayTask = tasks.find((task) => task.date === today);

    if (todayTask) {
      return todayTask.task;
    }
    return null;
  } catch (error) {
    console.error("Error reading tasks from CSV:", error);
    return null;
  }
};

/**
 * Updates the daily task in the database
 */
const updateDailyTask = async () => {
  try {
    const generatedTask = await generateTask();

    if (generatedTask) {
      console.log("Generated task:", generatedTask);
      await prisma.dailyTask.upsert({
        where: { id: 1 },
        update: { task: generatedTask },
        create: { id: 1, task: generatedTask },
      });
      console.log(`Task updated with generated task: ${generatedTask}`);
    } else {
      console.error("OpenAI task generation failed, falling back to CSV...");
      const taskFromCSV = getTaskFromCSV();

      if (taskFromCSV) {
        console.log("Fetched task from CSV:", taskFromCSV);
        await prisma.dailyTask.upsert({
          where: { id: 1 },
          update: { task: taskFromCSV },
          create: { id: 1, task: taskFromCSV },
        });
        console.log(`Task updated with CSV task: ${taskFromCSV}`);
      } else {
        console.error("No task found in CSV, task generation failed.");
      }
    }
  } catch (error) {
    console.error("Error updating task:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the task update function
updateDailyTask();
