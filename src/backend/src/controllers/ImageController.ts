import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller to handle file upload
export const uploadImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const { path, originalname, mimetype, size } = req.file;

  try {
    // Save file info in the database
    const newImage = await prisma.image.create({
      data: {
        filename: originalname,
        filePath: path,
        mimetype: mimetype,
        size: size,
      },
    });

    // Respond with success and file details
    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      file: newImage, // Send file details from the database
    });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};
