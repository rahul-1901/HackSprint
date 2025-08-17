import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],

  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hackathons",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  teamSize : {
    type : Number
  }
});

const TeamModel = mongoose.model("teams", teamSchema);
export default TeamModel;
