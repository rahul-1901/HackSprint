import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "submissions",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hackathons",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only vote once per submission
voteSchema.index({ submission: 1, user: 1 }, { unique: true });

const VoteModel = mongoose.model("votes", voteSchema);

export default VoteModel;
