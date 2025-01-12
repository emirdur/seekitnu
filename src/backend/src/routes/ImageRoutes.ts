import express from "express";
import upload from "../middlewares/MulterConfig"; // Import the multer configuration
import { uploadImage } from "../controllers/ImageController"; // Adjust import based on your file structure

const router = express.Router();

// Route to handle image upload
router.post("/upload", upload.single("image"), uploadImage);

export default router;
