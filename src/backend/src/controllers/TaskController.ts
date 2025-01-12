import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller to fetch the task
export const getTask = async (_req: Request, res: Response): Promise<any> => {
  try {
    const task = await prisma.task.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!task) {
      return res.status(404).json({ task: "No task found" });
    }

    res.json({ task: task.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching task" });
  }
};
