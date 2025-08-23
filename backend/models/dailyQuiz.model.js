import mongoose from "mongoose";

const dailyQuizSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,   // only one quiz per day
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "devquest",   // reference to your devquest collection
      required: true,
    }
  ]
}, { timestamps: true });

const dailyQuizModel = mongoose.model("dailyQuiz", dailyQuizSchema);
export default dailyQuizModel;