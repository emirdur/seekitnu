import express from "express";
import { getLeaderboard } from "../controllers/RankingController";

const router = express.Router();

/**
 * Handles ranking routes like fetching the leaderboard, streaks, or comparing wins.
 */
router.get("/retrieveLeaderboard", getLeaderboard);

export default router;
