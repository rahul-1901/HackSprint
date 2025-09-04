import SubmissionModel from "../models/submission.js";
import hackathonModel from "../models/hackathon.models.js";
import TeamModel from "../models/team.js";
import UserModel from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";

// ✅ helper: upload files to Cloudinary
const uploadFiles = async (files, resourceType, hackathonId) => {
  if (!files || files.length === 0) return [];

  const uploads = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: resourceType,
              folder: `hackathons/${hackathonId}`,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                public_id: result.public_id,
                url: result.secure_url,
                resource_type: result.resource_type,
                format: result.format,
                original_filename: result.original_filename,
                size: result.bytes,
              });
            }
          );
          stream.end(file.buffer); // 👈 Multer memoryStorage buffer
        })
    )
  );

  return uploads;
};

export const submitHackathonSolution = async (req, res) => {
  try {
    const { hackathonId, repoUrl, userId } = req.body || {};
    console.log("req.body =>", req.body);
    console.log("req.files =>", req.files);

    if (!hackathonId || !repoUrl) {
      return res
        .status(400)
        .json({ message: "Hackathon ID and repo URL are required" });
    }

    // ✅ check hackathon exists
    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    // ✅ check if user is in a team
    const team = await TeamModel.findOne({
      hackathon: hackathonId,
      $or: [{ leader: userId }, { members: userId }],
    });

    // ✅ upload files (if any)
    const docs = await uploadFiles(req.files?.docs || [], "raw", hackathonId);
    const images = await uploadFiles(
      req.files?.images || [],
      "image",
      hackathonId
    );
    const videos = await uploadFiles(
      req.files?.videos || [],
      "video",
      hackathonId
    );

    let submission;

    if (team) {
      // Only leader can submit
      if (team.leader.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Only the team leader can submit solution" });
      }

      // Prevent duplicate submission
      submission = await SubmissionModel.findOne({
        hackathon: hackathonId,
        team: team._id,
      });
      if (submission) {
        return res
          .status(400)
          .json({ message: "Team already submitted solution" });
      }

      // Save submission
      submission = await SubmissionModel.create({
        team: team._id,
        hackathon: hackathonId,
        repoUrl,
        submittedBy: userId,
        docs,
        images,
        videos,
      });

      hackathon.submissions.push(submission._id);
      await hackathon.save();

      // Update all team members
      const allMembers = [team.leader, ...team.members];
      await UserModel.updateMany(
        { _id: { $in: allMembers } },
        { $push: { submittedHackathons: submission._id } }
      );
    } else {
      // Individual submission
      submission = await SubmissionModel.findOne({
        hackathon: hackathonId,
        participant: userId,
      });
      if (submission) {
        return res
          .status(400)
          .json({ message: "You already submitted solution" });
      }

      submission = await SubmissionModel.create({
        participant: userId,
        hackathon: hackathonId,
        repoUrl,
        submittedBy: userId,
        docs,
        images,
        videos,
      });

      hackathon.submissions.push(submission._id);
      await hackathon.save();

      await UserModel.findByIdAndUpdate(userId, {
        $push: { submissions: submission._id },
      });
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
