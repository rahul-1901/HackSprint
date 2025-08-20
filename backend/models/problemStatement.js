// import mongoose from "mongoose";

// const problemStatementSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   baseRepoUrl: {
//     type: String,
//     required: true, // e.g., "https://github.com/hackathon-org/problem-1"
//   },
//   hackathon: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "hackathons",
//     required: true,
//   },
//   submissionMode: {
//     type: String,
//     enum: ["individual", "team", "both"],
//     default: "individual",
//   },
// });

// const ProblemStatementModel = mongoose.model(
//   "problemstatements",
//   problemStatementSchema
// );
// export default ProblemStatementModel;
