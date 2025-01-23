import express from "express";
import {
  checkUserImage,
  checkUsernameAvailability,
  getUser,
  signUp,
} from "../controllers/UserController"; // Import the controller

const router = express.Router();

// Auth Routes
router.post("/signup", signUp);
router.get("/:firebaseUid", getUser);

// User Routes
router.get("/:userId/image", checkUserImage);
router.get("/checkUsername/:username", checkUsernameAvailability);

export default router;
