import express from "express";
import { fetchTask } from "../controllers/TaskController";

const router = express.Router();

/**
 * Handles task related routes like fetching the task for the day.
 */
router.get("/fetchTask", fetchTask);

export default router;
