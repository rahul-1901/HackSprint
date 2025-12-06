import connectDB from "../db/database.js";
import devquestModel from "../models/devquest.model.js";
import dailyQuizModel from "../models/dailyQuiz.model.js";
import { getISTDayBounds } from "../utils/date.js";

export default async function handler(req, res) {
  // Only allow GET (Vercel Cron issues GET)
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();


    const { dayIST } = getISTDayBounds(new Date());

    // Idempotency: don't create if already exists
    const exists = await dailyQuizModel.findOne({ date: dayIST });
    if (exists) {
      console.log("Daily quiz already exists for", dayIST.toDateString());
      return res.status(200).json({ message: "already-created" });
    }

    const questions = await devquestModel.aggregate([
      { $match: { isAlreadyDisplayed: false } },
      { $sample: { size: 5 } }
    ]);

    if (!questions || questions.length === 0) {
      console.log("⚠ No more questions available to schedule.");
      return res.status(200).json({ message: "no-questions" });
    }

    const quiz = await dailyQuizModel.create({
      date: dayIST,
      questions: questions.map(q => q._id)
    });

    await devquestModel.updateMany(
      { _id: { $in: questions.map(q => q._id) } },
      { $set: { isAlreadyDisplayed: true } }
    );

    console.log("✅ New daily quiz created for", dayIST.toDateString());
    return res.status(200).json({ message: "ok", created: quiz._id });
  } catch (err) {
    console.error("❌ Error creating daily quiz:", err);
    return res.status(500).json({ error: err.message || "server-error" });
  }
}