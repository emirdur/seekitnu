import express from "express";
import { fetchTask } from "../controllers/TaskController";

const router = express.Router();

router.get("/fetchTask", fetchTask);

export default router;
