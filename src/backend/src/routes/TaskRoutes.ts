import { Router } from "express";
import { getTask } from "../controllers/TaskController";

const router = Router();

// Route to get the current task
router.get("/get-task", getTask);

export default router;
