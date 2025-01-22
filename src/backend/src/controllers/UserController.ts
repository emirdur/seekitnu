import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkUserImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params; // This is the Firebase UID, not the database user ID

  try {
    // Step 1: Find the user by their Firebase htUID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Step 2: Check if the user has an associated image
    const image = await prisma.image.findUnique({
      where: { userId: user.id },
    });

    if (image) {
      res
        .status(200)
        .json({ hasUploadedImage: true, imagePath: image.filePath });
    } else {
      res.status(200).json({ hasUploadedImage: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, firebaseUid } = req.body;

  if (!username || !firebaseUid) {
    res.status(400).json({ error: "Username and Firebase UID are required." });
    return;
  }

  try {
    // Check if a user with the same Firebase UID already exists
    const existingUserByUid = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (existingUserByUid) {
      res
        .status(400)
        .json({ error: "User with this Firebase UID already exists." });
      return;
    }

    // Check if a user with the same display name already exists
    const existingUserByDisplayName = await prisma.user.findFirst({
      where: { displayName: username }, // Searching by display name
    });

    if (existingUserByDisplayName) {
      res.status(400).json({ error: "Display name is already taken." });
      return;
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        displayName: username,
        firebaseUid: firebaseUid,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user." });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { firebaseUid } = req.params;

  try {
    // Fetch user data based on firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUid },
      select: {
        wins: true,
        rank: true,
        displayName: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Send user data as a response
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
