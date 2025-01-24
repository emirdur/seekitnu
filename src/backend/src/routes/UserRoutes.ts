import express from "express";
import {
  checkUserImage,
  checkUsernameAvailability,
  getUser,
  signUp,
} from "../controllers/UserController";

const router = express.Router();

/**
 * Handles the user routes like signing a user up, checking username availability, or getting the user.
 */

// Auth Routes
router.post("/signup", signUp);
router.get("/:firebaseUid", getUser);

// User Routes
router.get("/:userId/image", checkUserImage);
router.get("/checkUsername/:username", checkUsernameAvailability);

export default router;
