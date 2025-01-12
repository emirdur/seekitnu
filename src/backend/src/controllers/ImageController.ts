import { Request, Response } from "express";

// Controller to handle file upload
export const uploadImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  // Respond with success and file details
  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file, // Send file details as part of the response
  });
};
