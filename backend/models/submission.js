import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
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
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problemstatements",
    required: true,
  },
  repoUrl: {
    type: String,
    required: true,
  },
  githubMetadata: {
    stars: Number,
    forks: Number,
    language: String,
    updated_at: Date,
    open_issues: Number,
    watchers: Number,
    description: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const SubmissionModel = mongoose.model("submissions", submissionSchema);
export default SubmissionModel;
