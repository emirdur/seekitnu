import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchTask = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const dailyTask = await prisma.dailyTask.findUnique({
      where: { id: 1 },
    });

    if (!dailyTask) {
      res.status(404).json({ task: "Task not found for today." });
      return;
    } else {
      res.json({ task: dailyTask.task });
    }
  } catch (error) {
    res.status(500).json({ task: "Error fetching the task." });
  }
};
