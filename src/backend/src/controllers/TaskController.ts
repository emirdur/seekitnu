import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      res.status(500).json({ task: "No task available." });
    } else {
      res.json({ task: dailyTask.task });
    }
  } catch (error) {
    res.status(500).json({ task: "Error fetching the task." });
  }
};
