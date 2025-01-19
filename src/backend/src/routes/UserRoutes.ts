import express from "express";
import { checkUserImage, signUp } from "../controllers/UserController"; // Import the controller

const router = express.Router();

// Route to check if a user has uploaded an image
router.get("/:userId/image", checkUserImage);
router.post("/signup", signUp);

export default router;
