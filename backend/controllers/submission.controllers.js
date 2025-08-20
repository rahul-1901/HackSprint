// controllers/submission.controller.js
import SubmissionModel from "../models/submission.js";
import hackathonModel from "../models/hackathon.models.js";
import TeamModel from "../models/team.js";
import UserModel from "../models/user.models.js";

export const submitHackathonSolution = async (req, res) => {
  try {
    const { hackathonId, repoUrl,userId } = req.body;
    // const userId = req.user._id; // coming from auth middleware

    if (!hackathonId || !repoUrl) {
      return res.status(400).json({ message: "Hackathon ID and repo URL are required" });
    }

    // check hackathon exists
    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    // check if user has a team for this hackathon
    const team = await TeamModel.findOne({ hackathon: hackathonId, $or: [{ leader: userId }, { members: userId }] });

    let submission;

    if (team) {
      // if team, only leader can submit
      if (team.leader.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Only the team leader can submit solution" });
      }

      // check if already submitted
      submission = await SubmissionModel.findOne({ hackathon: hackathonId, team: team._id });
      if (submission) {
        return res.status(400).json({ message: "Team already submitted solution" });
      }

      // create submission
      submission = await SubmissionModel.create({
        team: team._id,
        hackathon: hackathonId,
        repoUrl,
        submittedBy: userId,
      });

      // update hackathon
      hackathon.submissions.push(submission._id);
      await hackathon.save();

      // update all team members (including leader)
      const allMembers = [team.leader, ...team.members];
      await UserModel.updateMany(
        { _id: { $in: allMembers } },
        { $push: { submittedHackathons: submission._id } }
      );
    } else {
      // individual submission
      submission = await SubmissionModel.findOne({ hackathon: hackathonId, participant: userId });
      if (submission) {
        return res.status(400).json({ message: "You already submitted solution" });
      }

      submission = await SubmissionModel.create({
        participant: userId,
        hackathon: hackathonId,
        repoUrl,
        submittedBy: userId,
      });

      // update hackathon
      hackathon.submissions.push(submission._id);
      await hackathon.save();

      // update user
      await UserModel.findByIdAndUpdate(userId, { $push: { submissions: submission._id } });
    }

    res.status(201).json({
      message: "Solution submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Error submitting hackathon solution:", error);
    res.status(500).json({ message: "Server error" });
  }
};
