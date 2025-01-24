import express from "express";
import upload from "../middlewares/MulterConfig";
import {
  getLikes,
  retrieveImages,
  toggleLike,
  uploadImage,
} from "../controllers/ImageController";

/**
 * Handles image routes like retrieving, like handling, or even uploading.
 */
const router = express.Router();

// Likes
router.get("/:userId/likes", getLikes);
router.post("/:id/toggleLike", toggleLike);

// Images
router.get("/retrieveImages", retrieveImages);

// Uploads
router.post("/upload", upload.single("image"), uploadImage);

export default router;
