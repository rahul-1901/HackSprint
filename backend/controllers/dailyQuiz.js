import cron from "node-cron";
import devquestModel from "../models/devquest.model.js";
import dailyQuizModel from "../models/dailyQuiz.model.js";
import { getISTDayBounds } from "../utils/date.js";


// cron.schedule("30 18 * * *", async () => {
//   try {
//     const { dayIST } = getISTDayBounds(new Date());

//     // Pick 5 random questions not yet displayed
//     const questions = await devquestModel.aggregate([
//       { $match: { isAlreadyDisplayed: false } },
//       { $sample: { size: 5 } }
//     ]);

//     if (!questions.length) {
//       console.log("⚠ No more questions available to schedule.");
//       return;
//     }

//     // Insert into dailyQuizModel
//     const quiz = await dailyQuizModel.create({
//       date: dayIST,
//       questions: questions.map(q => q._id)
//     });

//     // Mark them as displayed
//     await devquestModel.updateMany(
//       { _id: { $in: questions.map(q => q._id) } },
//       { $set: { isAlreadyDisplayed: true } }
//     );

//     console.log("✅ New daily quiz created for", dayIST.toDateString());
//   } catch (err) {
//     console.error("❌ Error creating daily quiz:", err.message);
//   }
// });

export const getDailyQuiz = async (req, res) => {
  try {
    const { startUTC, endUTC } = getISTDayBounds(new Date());

    const dailyQuiz = await dailyQuizModel
      .findOne({
        date: { $gte: startUTC, $lte: endUTC }
      })
      .populate("questions")
      .sort({ createdAt: -1 });

    if (!dailyQuiz) {
      return res.status(404).json({ message: "No quiz set for today yet" });
    }

    res.status(200).json({
      message: "Today's latest quiz",
      dailyQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendAllQuizData = async (req, res) => {
  try {
    const allQuizzes = await dailyQuizModel.find()
      .populate("questions")
      .sort({ createdAt: -1 });

    if (!allQuizzes || allQuizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found" });
    }
    
    const quizzesExcludingLatest = allQuizzes.slice(1);

    res.status(200).json({
      message: "Successfully retrieved quiz data (excluding latest)",
      quizData: quizzesExcludingLatest,
    });
  } catch (error) {
    console.error("Error in sendAllQuizData:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};