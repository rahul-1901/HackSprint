import mongoose from "mongoose";
import hackathonModel from "../models/hackathon.models.js";
import UserModel from "../models/user.models.js";
import SubmissionModel from "../models/submission.js";
import RegisteredParticipantsModel from "../models/registeredParticipants.js";
import PendingHackathon from "../models/pendingHackathon.model.js";
import Admin from "../models/admin.model.js";
import TeamModel from "../models/team.js";
import cloudinary from "../config/cloudinary.js";

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

// Approve a pending hackathon (controller-only)
export const approveHackathon = async (req, res) => {
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

    if (pending.approvals.includes(adminId)) {
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    pending.approvals.push(adminId);
    await pending.save();

    const controllers = await Admin.find({ controller: true }).select("_id");
    const allControllerIds = controllers.map(c => c._id.toString());
    const approvedIds = pending.approvals.map(a => a.toString());
    const allApproved = allControllerIds.every(id => approvedIds.includes(id));

    if (allApproved) {
      const hackathon = new hackathonModel(pending.toObject());
      delete hackathon._id; // Let MongoDB generate a new _id
      await hackathon.save();

      await PendingHackathon.findByIdAndDelete(pendingHackathonId);

      return res.status(200).json({
        success: true,
        message: "Hackathon approved by all controllers and moved to main collection",
        hackathon,
      });
    }

    res.status(200).json({
      success: true,
      message: "Hackathon approved. Waiting for other controller approvals.",
      approvals: pending.approvals.length,
    });
  } catch (err) {
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