import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Deals with uploading an image to the database
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const uploadImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // get the firebase id from the frontend
  const { userId } = req.body;

  // safety check
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const { filename } = req.file;

  try {
    // check if the user exists
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // check if the user already has an image
    const existingImage = await prisma.image.findUnique({
      where: { userId: user.id },
    });

    if (existingImage) {
      res.status(400).json({ message: "User already uploaded an image." });
      return;
    }

    // create the image and link it to the user
    const newImage = await prisma.image.create({
      data: {
        filePath: filename,
        userId: user.id,
      },
    });

    // update the user's imageId
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

/**
 * Retrieve all images in the database
 * @param _req The request from the frontend
 * @param res The response
 */
export const retrieveImages = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    // find all images
    const images = await prisma.image.findMany({
      include: {
        user: {
          select: { displayName: true },
        },
      },
    });

    // parse the images into an array with relevant info
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

/**
 * Toggle the like button
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const toggleLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firebaseUid } = req.body;
    const imageId = parseInt(req.params.id, 10); // convert imageid into integer

    if (!firebaseUid || isNaN(imageId)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // fetch the userid
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: firebaseUid,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // check if user already liked the image
    const existingLike = await prisma.userLike.findFirst({
      where: {
        userId: user.id,
        imageId,
      },
    });

    if (existingLike) {
      // user already liked the image, remove the like
      await prisma.userLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      // decrement the like count on the image
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
      // user hasn't liked the image, add a new like
      await prisma.userLike.create({
        data: {
          userId: user.id,
          imageId,
        },
      });

      // increment the like count on the image
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

/**
 * Gets the users liked images
 * @param req The request from the frontend
 * @param res The response
 * @returns void
 */
export const getLikes = async (req: Request, res: Response): Promise<void> => {
  const { userId: firebaseUid } = req.params;

  if (!firebaseUid || firebaseUid.trim() === "") {
    res.status(400).send("Invalid user ID");
    return;
  }

  try {
    // fetch the user record based on firebaseUid to get the userId
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: firebaseUid,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // query all likes from the user from userlike
    const likedImages = await prisma.userLike.findMany({
      where: {
        userId: user.id,
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
