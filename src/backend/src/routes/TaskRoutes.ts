import { Router, Request, Response } from "express";
import { generateTask } from "../controllers/OpenAIController";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/get-task", async (_req: Request, res: Response): Promise<any> => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: 1 },
    });

    if (!task) {
      return res.status(404).json({ message: "No task found" });
    }

    return res.json({ task: task.task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

export default router;
