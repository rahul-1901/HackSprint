import express from "express";
import { getDailyQuiz,sendAllQuizData } from "../controllers/dailyQuiz.js";

const router = express.Router();

// ✅ User route → fetch today’s quiz
router.get("/today", getDailyQuiz);
router.get("/allquiz" , sendAllQuizData);
// ⚠️ Admin route (optional if you still want manual control)
// import { setDailyQuiz } from "../controllers/dailyQuiz.controller.js";
// router.post("/set", setDailyQuiz);

export default router;
