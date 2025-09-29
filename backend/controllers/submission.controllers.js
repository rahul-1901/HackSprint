import path from "path";
import SubmissionModel from "../models/submission.js";
import hackathonModel from "../models/hackathon.models.js";
import TeamModel from "../models/team.js";
import UserModel from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";

// helper: get file extension
function getFileExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase(); // e.g. ".pdf" → "pdf"
}

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

    // Validate file types based on hackathon.allowedFileTypes (if provided)
    if (req.files && hackathon.allowedFileTypes) {
      for (const [field, files] of Object.entries(req.files)) {
        const allowed = hackathon.allowedFileTypes[field] || [];
        for (const file of files) {
          const ext = getFileExtension(file.originalname);
          if (!allowed.includes(ext)) {
            return res.status(400).json({
              message: `File type .${ext} is not allowed for ${field}. Allowed: ${allowed.join(
                ", "
              )}`,
            });
          }
        }
      }
    }

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
        $push: { submittedHackathons: submission._id },
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


export const getSubmissionStatus = async (req, res) => {
  try {
    const { hackathonId, teamId, userId } = req.query;

    if (!hackathonId || (!teamId && !userId)) {
      return res
        .status(400)
        .json({ message: "hackathonId and teamId or userId are required" });
    }

    // Look for either team submission or individual submission
    const submission = await SubmissionModel.findOne({
      hackathon: hackathonId,
      $or: [
        teamId ? { team: teamId } : null,
        userId ? { participant: userId } : null
      ].filter(Boolean),
    });

    if (!submission) {
      return res.status(200).json({ submitted: false });
    }

    return res.status(200).json({
      submitted: true,
      submission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSubmissionById = async (req, res) => {
  try {
    const submission = await SubmissionModel.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    return res.json(submission);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSubmissionsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    if (!hackathonId) {
      return res.status(400).json({ message: "hackathonId is required" });
    }

    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const submissions = await SubmissionModel.find({ hackathon: hackathonId })
      .populate({
        path: "participant",
        select: "name email",
      })
      .populate({
        path: "team",
        select: "name secretCode members leader",
        populate: {
          path: "members leader",
          select: "name email",
        },
      })
      .sort({ hackathonPoints: -1, submittedAt: 1 });

    const rankedSubmissions = submissions.map((sub, index) => ({
      rank: index + 1,
      ...sub.toObject(),
    }));

    return res.status(200).json({
      hackathon: hackathon.name,
      totalSubmissions: submissions.length,
      submissions: rankedSubmissions,
    });
  } catch (err) {
    console.error("Error fetching hackathon submissions:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};