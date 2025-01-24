import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sorts the users in leaderboard order
 * @param _req The request from the frontend
 * @param res The response
 */
export const getLeaderboard = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        wins: "desc",
      },
      select: {
        id: true,
        displayName: true,
        wins: true,
        rank: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching leaderboard");
  }
};
