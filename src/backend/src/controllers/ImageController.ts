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
  const { filename } = req.file; // Assuming multer provides `req.file` with `path`

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
        filePath: filename,
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

export const retrieveImages = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const images = await prisma.image.findMany({
      include: {
        user: {
          select: { displayName: true }, // Include username
        },
      },
    });

    const formattedImages = images.map((image) => ({
      id: image.id,
      username: image.user.displayName,
      imageUrl: image.filePath,
      likes: image.likes,
    }));

    res.status(200).json(formattedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { like } = req.body; // Boolean: true if liked, false if unliked

  try {
    // Fetch the current like count
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    // Update the like count
    const updatedLikes = like ? image.likes + 1 : image.likes - 1;

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(id, 10) },
      data: { likes: updatedLikes },
    });

    res.status(200).json({ likes: updatedImage.likes });
  } catch (error) {
    console.error("Error updating like count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
