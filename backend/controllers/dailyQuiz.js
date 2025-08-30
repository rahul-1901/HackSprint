import cron from "node-cron";
import devquestModel from "../models/devquest.model.js";
import dailyQuizModel from "../models/dailyQuiz.model.js";

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
const getDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Auto job: runs every 5 minutes (test mode)
cron.schedule("0 0 * * *", async () => {
  try {
    const today = getDateOnly(new Date());

    // Fetch 5 random questions
    const questions = await devquestModel.aggregate([
      { $sample: { size: 8 } }
    ]);

    // Always create a NEW quiz (don’t overwrite old ones)
    await dailyQuizModel.create({
      date: today, // keep today's date so we know when it belongs
      questions: questions.map(q => q._id)
    });

    console.log("✅ New daily quiz inserted at", new Date().toLocaleTimeString());
  } catch (err) {
    console.error("❌ Error creating daily quiz:", err.message);
  }
});
// // controllers/dailyQuiz.controller.js
export const getDailyQuiz = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const dailyQuiz = await dailyQuizModel
      .findOne({
        date: { $gte: startOfDay, $lt: endOfDay }
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

export const sendAllQuizData = async(req , res)=>{
  try{
    const quizData = await dailyQuizModel.find().populate("questions");
    res.status(200).json({
      "message" : "successfully retrieve the quiz data",
      quizData
    })
  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
}