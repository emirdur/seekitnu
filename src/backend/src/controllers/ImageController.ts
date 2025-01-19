import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const { path } = req.file; // Assuming multer provides `req.file` with `path`

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the user already has an image
    const existingImage = await prisma.image.findUnique({
      where: { userId: user.id },
    });

    if (existingImage) {
      res.status(400).json({ message: "User already uploaded an image." });
      return;
    }

    // Create the image and link it to the user
    const newImage = await prisma.image.create({
      data: {
        filePath: path,
        userId: user.id,
      },
    });

    // Update the user's `imageId` field
    await prisma.user.update({
      where: { id: user.id },
      data: { imageId: newImage.id },
    });

    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};
