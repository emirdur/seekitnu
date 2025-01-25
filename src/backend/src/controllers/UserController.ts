import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Checks whether a user has already uploaded an image
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const checkUserImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;

  try {
    // gets the user based on the firebase uid
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // gets the image (if there is one)
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

/**
 * Deals with signing up a user in the database (username wise)
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, firebaseUid } = req.body;

  if (!username || !firebaseUid) {
    res.status(400).json({ error: "Username and Firebase UID are required." });
    return;
  }

  try {
    // check if a user already exists (just in case)
    const existingUserByUid = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (existingUserByUid) {
      res
        .status(400)
        .json({ error: "User with this Firebase UID already exists." });
      return;
    }

    // check is display name taken (just in case)
    const existingUserByDisplayName = await prisma.user.findFirst({
      where: { displayName: username },
    });

    if (existingUserByDisplayName) {
      res.status(400).json({ error: "Display name is already taken." });
      return;
    }

    // create a new user
    const user = await prisma.user.create({
      data: {
        displayName: username,
        firebaseUid: firebaseUid,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};

/**
 * Checks if username is available
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const checkUsernameAvailability = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username } = req.params;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { displayName: username },
    });

    if (existingUser) {
      res.status(200).json({ available: false });
      return;
    }

    res.status(200).json({ available: true });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to check username availability." });
  }
};

/**
 * Gets the user based on the firebase id
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { firebaseUid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUid },
      select: {
        wins: true,
        rank: true,
        displayName: true,
      },
    });

    if (!user) {
      res.json({ exists: false });
      return;
    }

    // If user exists, return exists: true and user data
    res.json({ exists: true, user });
    return;
  } catch (error) {
    // If an error occurs, handle the error and return a response with status 500
    console.error(error); // For logging purposes, you may want to log the error details
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
