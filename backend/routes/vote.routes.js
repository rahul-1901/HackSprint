import express from "express";
import {
  toggleVote,
  getHackathonVotes,
  getUserVotes,
  getSubmissionVoteCount,
} from "../controllers/vote.controllers.js";
import { verifyAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Toggle vote (add/remove) - requires authentication
router.post("/toggle", verifyAuth, toggleVote);

// Get all votes for a hackathon with submission details
router.get("/hackathon/:hackathonId", getHackathonVotes);

// Get user's votes for a specific hackathon - requires authentication
router.get("/user/:hackathonId", verifyAuth, getUserVotes);

// Get vote count for a specific submission
router.get("/submission/:submissionId", getSubmissionVoteCount);

export default router;
