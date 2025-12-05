// import mongoose from "mongoose";

// const pendingHackathonSchema = new mongoose.Schema({
//   image: { type: String },
//   title: { type: String, required: true },
//   subTitle: { type: String },
//   description: { type: String },
//   submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "submissions" }],
//   startDate: { type: Date },
//   endDate: { type: Date },
//   submissionStartDate: { type: Date },
//   submissionEndDate: { type: Date },
//   refMaterial: { type: String },
//   status: { type: Boolean, default: false },
//   difficulty: {
//     type: String,
//     enum: ["Advanced", "Expert", "Intermediate", "Beginner"],
//   },
//   category: { type: [String] },
//   prizeMoney: { type: Number },
//   techStackUsed: { type: [String] },
//   numParticipants: { type: Number, default: 0 },
//   overview: { type: String },
//   themes: { type: [String] },
//   FAQs: { type: [String] },
//   teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "teams" }],
//   aboutUs: { type: String },
//   projectSubmission: { type: [String] },
//   TandCforHackathon: { type: [String] },
//   evaluationCriteria: { type: [String] },
//   registeredParticipants: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "registeredParticipants" },
//   ],
//   allowedFileTypes: {
//     docs: { type: [String], default: ["pdf", "docx"] },
//     images: { type: [String], default: ["jpg", "jpeg", "png"] },
//     videos: { type: [String], default: ["mp4"] },
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Admin",
//   },

//   // Approval Tracking
//   approvals: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "admins", // who approved
//     },
//   ],
//   rejectedBy: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "admins", // if someone rejects
//     },
//   ],
// }, { timestamps: true });

// const PendingHackathon = mongoose.model("pendingHackathons", pendingHackathonSchema);

// export default PendingHackathon;

import mongoose from "mongoose";

const pendingHackathonSchema = new mongoose.Schema({
  image: { type: String },
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "submissions" }],
  startDate: { type: Date },
  endDate: { type: Date },
  submissionStartDate: { type: Date },
  submissionEndDate: { type: Date },
  refMaterial: { type: String },
  status: { type: Boolean, default: false },
  difficulty: {
    type: String,
    enum: ["Advanced", "Expert", "Intermediate", "Beginner"],
  },
  category: { type: [String] },
  prizeMoney1: { type: Number, default: 0 },
  prizeMoney2: { type: Number, default: 0 },
  prizeMoney3: { type: Number, default: 0 },
  techStackUsed: { type: [String] },
  numParticipants: { type: Number, default: 0 },
  overview: { type: String },
  themes: { type: [String] },
  FAQs: { type: [String] },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "teams" }],
  aboutUs: { type: String },
  projectSubmission: { type: [String] },
  TandCforHackathon: { type: [String] },
  evaluationCriteria: { type: [String] },
  registeredParticipants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "registeredParticipants" },
  ],
  allowedFileTypes: {
    docs: { type: [String], default: ["pdf", "docx"] },
    images: { type: [String], default: ["jpg", "jpeg", "png"] },
    videos: { type: [String], default: ["mp4"] },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  // Approval Tracking
  approvals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins", // who approved
    },
  ],
  rejectedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins", // if someone rejects
    },
  ],
}, { timestamps: true });

const PendingHackathon = mongoose.model("pendingHackathons", pendingHackathonSchema);

export default PendingHackathon;