import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    name: {
      type: String,
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    role: {
      type: String,
      enum: ["participant", "organizer", "admin"],
      default: "participant",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpiresAt: Date,

    verificationToken: {
      type: String,
      default: "",
    },
    isGitHubloggedIn: {
      type: Boolean,
      default: false
    },
    isGoogleLoggedIn: {
      type: Boolean,
      default: false
    },
    gitHubLink: {
      type: String
    },
    gitHubAccessToken: {
      type: String,
      default: ""
      // required: true
    },
    streaks: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    devQuestionsCorrectlyAnswered: {
      type: Number,
      default: 0
    },
    devQuestionsIncorrectlyAnswered: {
      type: Number,
      default: 0
    },
    currentQuizPoints: { type: Number, default: 0 }, // earned in current quiz
    currentQuizTotalPoints: { type: Number, default: 0 },
    contactNumber: {
      type: String,
      // required: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    registeredHackathons: [
      { type: mongoose.Schema.Types.ObjectId, ref: "hackathons" }
    ],
    submittedHackathons: [
      { type: mongoose.Schema.Types.ObjectId, ref: "hackathons" }
    ],
    attemptedDevQuestions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "dailyQuiz" }
    ],
    devQuestionSubmittedTime : {
      type : Date
    },
    institute: {
      type: String
    },
    passOutYear: {
      type: Number
    },
    department: {
      type: String
    },
    connectedApps: [
      {
        appName: { type: String, required: true },
        appURL: { type: String, required: true }
      }
    ],
    verificationTokenExpiresAt: Date,
    // Submissions
  },
  { timestamps: true }
);

userSchema.virtual("submissions", {
  ref: "submissions",
  localField: "_id",
  foreignField: "participant",
});
const UserModel = mongoose.model("users", userSchema)

export default UserModel