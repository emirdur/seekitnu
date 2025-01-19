import express from "express";
import { checkUserImage, getUser, signUp } from "../controllers/UserController"; // Import the controller

const router = express.Router();

// Route to check if a user has uploaded an image
router.get("/:userId/image", checkUserImage);
router.get("/:firebaseUid", getUser);
router.post("/signup", signUp);

export default router;
