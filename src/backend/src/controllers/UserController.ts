import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const checkUserImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const userImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      `${userId}.jpg`,
    );
    if (fs.existsSync(userImagePath)) {
      res.json({ hasUploadedImage: true });
    } else {
      res.json({ hasUploadedImage: false });
    }
  } catch (error) {
    console.error("Error checking user image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
