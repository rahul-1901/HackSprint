import express from "express";
import { submitHackathonSolution } from "../controllers/submission.controllers.js";
// import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/" ,submitHackathonSolution);

export default router;