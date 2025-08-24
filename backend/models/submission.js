import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teams",
    default: null,
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hackathons",
    required: true,
  },
  // problem: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "problemstatements",
  //   // required: true,
  // },
  repoUrl: {
    type: String,
    required: true,
  },
  githubMetadata: {
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    language: { type: String, default: "" },
    updated_at: { type: Date, default: null },
    open_issues: { type: Number, default: 0 },
    watchers: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});
// Ensure either participant OR team is set (not both null)
submissionSchema.pre("validate", function (next) {
  if (!this.participant && !this.team) {
    return next(new Error("Either participant or team must be provided"));
  }
  next();
});

const SubmissionModel = mongoose.model("submissions", submissionSchema);
export default SubmissionModel;
