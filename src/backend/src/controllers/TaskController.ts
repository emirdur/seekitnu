import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { generateTask } from "../utils/openaiClient";

const prisma = new PrismaClient();

/**
 * Fallback function to get tasks from CSV
 * @returns {string | null} Task for today or null if not found
 */
const getTaskFromCSV = (): string | null => {
  try {
    const tasksPath = path.join(__dirname, "..", "tasks.csv");
    const tasks = fs
      .readFileSync(tasksPath, "utf-8")
      .split("\n")
      .map((line) => {
        const [date, task] = line.split(",");
        return { date: date.trim(), task: task.trim().replace(/"/g, "") };
      });

    const today = new Date().toISOString().split("T")[0];
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
 * Fetches the task from the database or generates one using OpenAI
 * Falls back to the CSV if OpenAI fails
 * @param _req The request from the frontend
 * @param res The response
 * @returns void
 */
export const fetchTask = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const dailyTask = await prisma.dailyTask.findUnique({
      where: { id: 1 },
    });

    if (!dailyTask) {
      const generatedTask = await generateTask();

      if (generatedTask) {
        await prisma.dailyTask.create({
          data: { task: generatedTask },
        });

        res.json({ task: generatedTask });
      } else {
        const taskFromCSV = getTaskFromCSV();
        if (taskFromCSV) {
          res.json({ task: taskFromCSV });
        } else {
          res.status(500).json({ task: "No task available." });
        }
      }
    } else {
      res.json({ task: dailyTask.task });
    }
  } catch (error) {
    res.status(500).json({ task: "Error fetching the task." });
  }
};
