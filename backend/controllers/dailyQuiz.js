import cron from "node-cron";
import devquestModel from "../models/devquest.model.js";
import dailyQuizModel from "../models/dailyQuiz.model.js";
import { getISTDayBounds } from "../utils/date.js";

// Helper: get today's date without time
// const getDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Auto job: runs every midnight (00:00)
//   cron.schedule("*/5 * * * *", async () => {
//     try {
//       // const today = getDateOnly(new Date());

//       // // If today's quiz already exists, skip
//       // const exists = await dailyQuizModel.findOne({ date: today });
//       // if (exists) return;

//       // // Get yesterday's quiz to avoid repetition
//       // const yesterday = getDateOnly(new Date(Date.now() - 86400000));
//       // const yesterdaysQuiz = await dailyQuizModel.findOne({ date: yesterday });

//       // let excludeIds = [];
//       // if (yesterdaysQuiz) {
//       //   excludeIds = yesterdaysQuiz.questions.map(q => q.toString());
//       // }

//       // // Fetch random questions excluding yesterday's
//       // const questions = await devquestModel.aggregate([
//       //   { $match: { _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
//       //   { $sample: { size: 5 } }
//       // ]);

//       // // Save today’s quiz
//       // await dailyQuizModel.create({
//       //   date: today,
//       //   questions: questions.map(q => q._id)
//       // });
//       const today = getDateOnly(new Date());

//       const questions = await devquestModel.aggregate([
//         { $sample: { size: 5 } }
//       ]);

//       // Always update/replace today’s quiz
//       await dailyQuizModel.findOneAndUpdate(
//         { date: today },
//         { questions: questions.map(q => q._id) },
//         { upsert: true, new: true }
//       );

//       console.log("✅ Daily quiz (test mode) refreshed at", new Date().toLocaleTimeString());

//       // console.log("✅ Daily quiz created for", today.toDateString());
//     } catch (err) {
//       console.error("❌ Error creating daily quiz:", err.message);
//     }
//   });
// const getDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// // Auto job: runs every 5 minutes (test mode)
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const today = getDateOnly(new Date());

//     // Fetch 5 random questions
//     const questions = await devquestModel.aggregate([
//       { $sample: { size: 8 } }
//     ]);

//     // Always create a NEW quiz (don’t overwrite old ones)
//     await dailyQuizModel.create({
//       date: today, // keep today's date so we know when it belongs
//       questions: questions.map(q => q._id)
//     });

//     console.log("✅ New daily quiz inserted at", new Date().toLocaleTimeString());
//   } catch (err) {
//     console.error("❌ Error creating daily quiz:", err.message);
//   }
// });
// Runs every day at 00:00 IST
// IST midnight = 18:30 UTC (previous day)
cron.schedule("30 18 * * *", async () => {
  try {
    const { dayIST } = getISTDayBounds(new Date());

    // Pick 5 random questions not yet displayed
    const questions = await devquestModel.aggregate([
      { $match: { isAlreadyDisplayed: false } },
      { $sample: { size: 5 } }
    ]);

    if (!questions.length) {
      console.log("⚠️ No more questions available to schedule.");
      return;
    }

    // Insert into dailyQuizModel
    const quiz = await dailyQuizModel.create({
      date: dayIST,
      questions: questions.map(q => q._id)
    });

    // Mark them as displayed
    await devquestModel.updateMany(
      { _id: { $in: questions.map(q => q._id) } },
      { $set: { isAlreadyDisplayed: true } }
    );

    console.log("✅ New daily quiz created for", dayIST.toDateString());
  } catch (err) {
    console.error("❌ Error creating daily quiz:", err.message);
  }
});

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
