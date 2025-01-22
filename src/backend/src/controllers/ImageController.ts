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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firebaseUid } = req.body; // Firebase UID from the request body
    const imageId = parseInt(req.params.id, 10); // Image ID from the route params

    if (!firebaseUid || isNaN(imageId)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // Fetch the userId from the database using firebaseUid
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: firebaseUid, // Fetch the user using the firebase UID
      },
      select: {
        id: true, // Get the userId
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if the user already liked the image
    const existingLike = await prisma.userLike.findFirst({
      where: {
        userId: user.id, // Use the userId from the fetched user record
        imageId,
      },
    });

    if (existingLike) {
      // User already liked the image, remove the like
      await prisma.userLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Decrement the like count on the image
      await prisma.image.update({
        where: {
          id: imageId,
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      res.status(200).json({ message: "Like removed" });
    } else {
      // User hasn't liked the image, add a new like
      await prisma.userLike.create({
        data: {
          userId: user.id, // Use the userId
          imageId,
        },
      });

      // Increment the like count on the image
      await prisma.image.update({
        where: {
          id: imageId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      res.status(201).json({ message: "Like added" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to fetch user's liked images
export const getLikes = async (req: Request, res: Response): Promise<void> => {
  const { userId: firebaseUid } = req.params;

  if (!firebaseUid || firebaseUid.trim() === "") {
    res.status(400).send("Invalid user ID");
    return;
  }

  try {
    // Fetch the user record based on firebaseUid to get the userId
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: firebaseUid, // Fetch the user using the firebase UID
      },
      select: {
        id: true, // Retrieve the userId (integer)
      },
    });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Now that you have the userId, query the UserLike model
    const likedImages = await prisma.userLike.findMany({
      where: {
        userId: user.id, // Use the userId from the database
      },
      select: {
        imageId: true,
      },
    });

    const likedImageIds = likedImages.map((like) => like.imageId);

    res.json(likedImageIds);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
