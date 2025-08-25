import mongoose from "mongoose";

const dailyQuizSchema = new mongoose.Schema({
  Title : {
    type : String,
    default : "ABC TOPIC"
  },
  date: {
    type: Date,
    required: true,
    // unique: true,  // only one quiz per da
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "devquest",   // reference to your devquest collection
      required: true,
    }
  ],
  attemptedBy : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "users"
  }]
}, { timestamps: true });

const dailyQuizModel = mongoose.model("dailyQuiz", dailyQuizSchema);
export default dailyQuizModel;