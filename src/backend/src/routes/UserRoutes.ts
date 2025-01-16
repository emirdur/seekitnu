import express from "express";
import { checkUserImage } from "../controllers/UserController"; // Import the controller

const router = express.Router();

// Route to check if a user has uploaded an image
router.get("/:userId/image", checkUserImage);

export default router;
