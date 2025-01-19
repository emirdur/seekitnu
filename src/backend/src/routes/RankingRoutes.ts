import express from "express";
import { getLeaderboard } from "../controllers/RankingController";

const router = express.Router();

// Route to handle image upload
router.get("/retrieveLeaderboard", getLeaderboard);

export default router;
