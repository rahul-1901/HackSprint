import mongoose from "mongoose";
import hackathonModel from "../models/hackathon.models.js";
import UserModel from "../models/user.models.js";
import SubmissionModel from "../models/submission.js";
import RegisteredParticipantsModel from "../models/registeredParticipants.js";
import PendingHackathon from "../models/pendingHackathon.model.js";
import Admin from "../models/admin.model.js";
import TeamModel from "../models/team.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/aws.js";
import fs from "fs";
// import cloudinary from "../config/cloudinary.js"; // COMMENTED OUT - REPLACED WITH AWS S3

// Get all hackathons created by a specific admin
export const getAllHackathons = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required." });
    }
    const hackathons = await hackathonModel.find({ "createdBy": adminId });
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detailed information for a single hackathon created by an admin
export const getMyHackathon = async (req, res) => {
  try {
    const { adminId, hackathonId } = req.body;

    // 1. Fetch the main hackathon document
    const hackathon = await hackathonModel.findOne({
      _id: hackathonId,
      createdBy: adminId
    });

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found or you are not the creator." });
    }

    // 2. Fetch all related data from the database in parallel
    const [participants, teams, submissions] = await Promise.all([
      RegisteredParticipantsModel.find({ hackathon: hackathonId }).populate('user', 'name email').lean(),
      TeamModel.find({ hackathon: hackathonId }).populate("leader", "name email").populate("members", "name email").lean(),
      SubmissionModel.find({ hackathon: hackathonId }).lean()
    ]);

    // 3. Manually link submissions to their corresponding teams
    const teamsWithSubmissions = teams.map(team => {
      // For each team, find its submission in the submissions array
      const submission = submissions.find(s => s.team?.toString() === team._id.toString());
      return {
        ...team,
        submission: submission || null // Attach the submission object, or null if none exists
      };
    });

    // 4. Manually link submissions to their corresponding individual participants
    const participantsWithSubmissions = participants.map(p => {
      // For each participant, find their submission in the submissions array
      // Note: We link by the user's ID (p.user._id)
      if (!p.user?._id) {
        return {
          ...p,
          user: { name: "Deleted User", email: "" },
          submission: null,
        };
      }
      const submission = submissions.find(s => s.participant?.toString() === p.user._id.toString());
      return {
        ...p,
        submission: submission || null // Attach the submission object, or null if none exists
      }
    })

    // 5. Send the final, combined data to the frontend
    res.json({
      hackathon,
      participantsWithoutTeam: participantsWithSubmissions.filter(p => !p.team),
      teams: teamsWithSubmissions,
    });

  } catch (err) {
    console.error("Error in getMyHackathon:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a list of all admins
export const getalladmin = async (req, res) => {
  try {
    const admindetails = await Admin.find().select("-password"); // Exclude passwords
    res.status(200).json({
      admindetails
    });
  } catch (err) {
    res.status(404).json({
      "message": err.message
    });
  }
};

// Create a new hackathon and place it in the pending queue
export const createPendingHackathon = async (req, res) => {
  try {
    let imageUrl = "";

    // ================= IMAGE UPLOAD (UNCHANGED LOGIC) =================
    if (req.file) {
      try {
        const fileContent = fs.readFileSync(req.file.path);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const key = `hackathons/images/${timestamp}-${randomString}-${req.file.originalname}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType: req.file.mimetype,
        });

        await s3Client.send(putObjectCommand);

        imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
          process.env.AWS_REGION || "ap-southeast-2"
        }.amazonaws.com/${key}`;

        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Error uploading to AWS S3:", error);
        throw new Error(`File upload failed: ${error.message}`);
      }
    }

    // ================= DATA PROCESSING =================
    const data = { ...req.body };

    // 🔥 UNIVERSAL SAFE JSON PARSER (Fix for empty arrays/objects issue)
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string") {
        const value = data[key].trim();

        // Try parsing only if looks like JSON
        if (
          (value.startsWith("{") && value.endsWith("}")) ||
          (value.startsWith("[") && value.endsWith("]"))
        ) {
          try {
            data[key] = JSON.parse(value);
          } catch (err) {
            console.warn(`Failed to parse JSON field: ${key}`);
          }
        }
      }
    });

    // ================= REQUIRED FIELDS =================
    if (!data.adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    data.createdBy = data.adminId;
    delete data.adminId;

    if (imageUrl) {
      data.image = imageUrl;
    }

    // Ensure default arrays exist if not provided
    const defaultArrayFields = [
      "techStackUsed",
      "category",
      "themes",
      "problems",
      "TandCforHackathon",
      "evaluationCriteria",
      "FAQs",
      "projectSubmission", // ✅ ADD THIS
      "gallery",
      "approvals",
      "rejectedBy",
      "rewards", // ✅ ADD THIS for new rewards system
    ];

    defaultArrayFields.forEach((field) => {
      if (!Array.isArray(data[field])) {
        data[field] = [];
      }
    });

    // Ensure object defaults
    if (!data.allowedFileTypes || typeof data.allowedFileTypes !== "object") {
      data.allowedFileTypes = {};
    }

    // ================= SAVE TO DB =================
    const pendingHackathon = new PendingHackathon(data);
    await pendingHackathon.save();

    return res.status(201).json({
      success: true,
      message: "Hackathon created and waiting for approval",
      pendingHackathon,
    });
  } catch (err) {
    console.error("Create Pending Hackathon Error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/* ✅ OLD CLOUDINARY CODE (COMMENTED OUT)
export const createPendingHackathon = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "hackathons" });
      imageUrl = result.secure_url;
    }

    const data = req.body;

    // ----- START of NECESSARY CHANGE -----
    // This safely parses the fields that were sent as JSON strings from the frontend
    const arrayFields = ['techStackUsed', 'category', 'themes', 'problems', 'TandCforHackathon', 'evaluationCriteria', 'FAQs'];
    arrayFields.forEach(field => {
      if (data[field] && typeof data[field] === 'string') {
        data[field] = JSON.parse(data[field]);
      }
    });
    // ----- END of NECESSARY CHANGE -----

    data.createdBy = req.body.adminId;
    delete data.adminId;
    data.image = imageUrl || "";

    const pendingHackathon = new PendingHackathon(data);
    await pendingHackathon.save();

    res.status(201).json({
      success: true,
      message: "Hackathon created and waiting for approval",
      pendingHackathon,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
*/

// Approve a pending hackathon (controller-only)
export const approveHackathon = async (req, res) => {
  try {
    console.log("=== APPROVAL REQUEST ===");
    const { pendingHackathonId, adminId } = req.body;
    console.log("Pending Hackathon ID:", pendingHackathonId);
    console.log("Admin ID:", adminId);

    const admin = await Admin.findById(adminId);
    console.log("Admin found:", admin ? admin.adminName : "Not found");
    console.log("Is controller:", admin?.controller);

    if (!admin || !admin.controller) {
      return res.status(403).json({ success: false, message: "Not a controller admin" });
    }

    const pending = await PendingHackathon.findById(pendingHackathonId);
    if (!pending) {
      return res.status(404).json({ success: false, message: "Pending hackathon not found" });
    }
    console.log("Pending hackathon found:", pending.title);

    if (pending.approvals.includes(adminId)) {
      console.log("Already approved - returning 400");
      console.log("=== END APPROVAL REQUEST ===");
      res.status(400).json({ success: false, message: "Already approved" });
    }

    pending.approvals.push(adminId);
    await pending.save();
    console.log("Approval added. Total approvals:", pending.approvals.length);

    const controllers = await Admin.find({ controller: true }).select("_id");
    console.log("Total controllers:", controllers.length);
    const allControllerIds = controllers.map(c => c._id.toString());
    const approvedIds = pending.approvals.map(a => a.toString());
    console.log("Controller IDs:", allControllerIds);
    console.log("Approved IDs:", approvedIds);
    const allApproved = allControllerIds.every(id => approvedIds.includes(id));
    console.log("All approved?", allApproved);

    if (allApproved) {
      console.log("All controllers approved! Moving to main collection...");

      // Convert pending hackathon to plain object and clean it
      const pendingData = pending.toObject();
      console.log("Pending data fields:", Object.keys(pendingData));

      // Remove fields that don't belong in the main hackathon model
      delete pendingData._id;
      delete pendingData.approvals;
      delete pendingData.rejectedBy;
      delete pendingData.createdAt;
      delete pendingData.updatedAt;
      delete pendingData.__v;

      // Add gallery field (empty array) if not present
      if (!pendingData.gallery) {
        pendingData.gallery = [];
      }

      // Determine the correct status based on dates
      const now = new Date();
      console.log("Current date:", now);
      console.log("Start date:", pendingData.startDate);
      console.log("Submission end date:", pendingData.submissionEndDate);

      const isActive = pendingData.startDate <= now && pendingData.submissionEndDate >= now;
      pendingData.status = isActive;
      console.log("Is active?", isActive);
      console.log("Setting status to:", pendingData.status);

      // Create and save the hackathon
      const hackathon = new hackathonModel(pendingData);
      await hackathon.save();
      console.log("Hackathon saved with ID:", hackathon._id);
      console.log("Hackathon status:", hackathon.status);

      // Delete the pending hackathon
      await PendingHackathon.findByIdAndDelete(pendingHackathonId);
      console.log("Pending hackathon deleted");
      console.log("=== END APPROVAL REQUEST ===");

      return res.status(200).json({
        success: true,
        message: "Hackathon approved by all controllers and moved to main collection",
        hackathon,
        isActive: isActive ? "Hackathon is now active" : "Hackathon is upcoming or expired"
      });
    }

    console.log("Not all controllers approved yet");
    console.log("=== END APPROVAL REQUEST ===");

    res.status(200).json({
      success: true,
      message: "Hackathon approved. Waiting for other controller approvals.",
      approvals: pending?.approvals?.length,
    });
  } catch (err) {
    console.error("Approval error:", err);
    console.log("=== END APPROVAL REQUEST (ERROR) ===");
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject a pending hackathon (controller-only)
export const rejectHackathon = async (req, res) => {
  try {
    const { pendingHackathonId, adminId } = req.body;
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.controller) {
      return res.status(403).json({ success: false, message: "Not a controller admin" });
    }

    const pending = await PendingHackathon.findById(pendingHackathonId);
    if (!pending) {
      return res.status(404).json({ success: false, message: "Pending hackathon not found" });
    }

    pending.rejectedBy.push(adminId);
    await pending.save();

    return res.status(200).json({
      success: true,
      message: "Hackathon rejected and stays in pending list",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Display all pending hackathons
export const displayPendingHackathon = async (req, res) => {
  try {
    const pendingHackathonsData = await PendingHackathon.find();
    res.status(200).json({
      pendingHackathonsData
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateHackathonPoint = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { adminId, submissionId, points } = req.body;
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (!submissionId || typeof points !== "number") {
      return res.status(400).json({
        success: false,
        message: "Request body must include submissionId and points (number).",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ success: false, message: "Invalid submissionId" });
    }

    // Load submission (we'll use session in transaction)
    const submission = await SubmissionModel.findById(submissionId).session(session);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const hackathon = await hackathonModel.findById(submission.hackathon).select("createdBy");
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon for this submission not found" });
    }

    if (hackathon.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update points for submissions of this hackathon",
      });
    }

    // Start transaction
    session.startTransaction();

    // Update submission's hackathonPoints to the provided points
    const updatedSubmission = await SubmissionModel.findByIdAndUpdate(
      submissionId,
      { $set: { hackathonPoints: points } },
      { new: true, runValidators: true, session }
    );

    // Build list of user ids to update (leader + members OR participant)
    const userIds = [];
    if (submission.team) {
      const team = await TeamModel.findById(submission.team).select("leader members").lean();
      if (team) {
        if (team.leader) userIds.push(team.leader);
        if (Array.isArray(team.members) && team.members.length) {
          userIds.push(...team.members);
        }
      }
    } else if (submission.participant) {
      userIds.push(submission.participant);
    }

    // Dedupe and filter ids
    const uniqueUserIds = [...new Set(userIds.map(id => id?.toString()).filter(Boolean))];

    let usersUpdatedCount = 0;
    if (uniqueUserIds.length) {
      // Set each user's hackathonPoints to the incoming points value
      const updateResult = await UserModel.updateMany(
        { _id: { $in: uniqueUserIds } },
        { $set: { hackathonPoints: points } },
        { session }
      );
      usersUpdatedCount = updateResult.nModified ?? updateResult.modifiedCount ?? 0;
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "hackathonPoints updated on submission and users",
      submission: updatedSubmission,
      usersUpdatedCount,
      setToPoints: points,
    });
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (e) {
      // ignore abort errors
    }
    session.endSession();
    console.error("updateHackathonPoint error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


// Get the profile details of the currently logged-in admin
export const getAdminDetails = async (req, res) => {
  try {
    // The admin object is attached to the request by the adminAuth middleware
    const admin = req.admin;

    if (!admin) {
      // This is a safeguard, but adminAuth should have already handled it
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.adminName,
        email: admin.email,
        avatar: admin.avatar,
        contactNumber: admin.contactNumber,
        isVerified: admin.isVerified,
        controller: admin.controller,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (err) {
    console.error("getAdminDetails error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};