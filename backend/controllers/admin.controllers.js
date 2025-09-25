import hackathonModel from "../models/hackathon.models.js";
import SubmissionModel from "../models/submission.js";
import RegisteredParticipantsModel from "../models/registeredParticipants.js";
import cloudinary from "../config/cloudinary.js"  // your cloudinary config file
import PendingHackathon from "../models/pendingHackathon.model.js";
import Admin from "../models/admin.model.js";

// Get all hackathons created by logged-in admin
export const getAllHackathons = async (req, res) => {
  try {
    const { adminId } = await req.body;
    const hackathons = await hackathonModel.find({ "createdBy": adminId });
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getMyHackathon = async (req, res) => {
  try {
    const { adminId, hackathonId } = req.body;

    // First fetch hackathon basic info (without direct population of participants & teams)
    const hackathon = await hackathonModel.findOne({
      _id: hackathonId,
      createdBy: adminId
    });

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Fetch registered participants separately
    const participants = await RegisteredParticipantsModel.find({
      hackathon: hackathonId
    })

    // Separate participants: with team vs without team
    const withoutTeam = participants.filter(p => !p.team);
    const withTeam = participants.filter(p => p.team);

    // Fetch teams and populate members
    const teams = await TeamModel.find({ hackathon: hackathonId })
      .populate("leader", "name email")
      .populate("members", "name email")
      .lean();

    // Attach participants info to each team (for quick lookup)
    const teamsWithMembers = teams.map(team => {
      const teamMembers = withTeam.filter(p => p.team?.toString() === team._id.toString());
      return {
        ...team,
        registeredMembers: teamMembers
      };
    });

    // Fetch submissions
    const submissions = await SubmissionModel.find({ hackathon: hackathonId })
      .select("_id repoUrl githubMetadata docs images videos submittedAt hackathonPoints")
      .lean();

    res.json({
      hackathon,
      participantsWithoutTeam: withoutTeam,
      teams: teamsWithMembers,
      submissions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getalladmin = async (req, res) => {
  try {
    const admindetails = await Admin.find();
    res.status(200).json({
      admindetails
    })
  } catch (err) {
    res.status(404).json({
      "message": err.message
    })
  }
}
export const createPendingHackathon = async (req, res) => {
  try {
    let imageUrl = ""

    // if file is uploaded, push to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hackathons"  // optional: creates folder in Cloudinary
      })
      imageUrl = result.secure_url
    }

    const data = req.body;
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
    })
  }
}
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

    // If already approved by this admin
    if (pending.approvals.includes(adminId)) {
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    pending.approvals.push(adminId);
    await pending.save();

    // Check if all controller admins approved
    const controllers = await Admin.find({ controller: true }).select("_id");
    const allControllerIds = controllers.map(c => c._id.toString());

    const approvedIds = pending.approvals.map(a => a.toString());

    const allApproved = allControllerIds.every(id => approvedIds.includes(id));

    if (allApproved) {
      // Move to hackathon collection
      const hackathon = new hackathonModel(pending.toObject());
      delete hackathon._id; // new _id will be assigned
      await hackathon.save();

      // Delete from pending
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
export const displayPendingHackathon = async (req, res) => {
  try {
    const pendingHackathonsData = await PendingHackathon.find();
    res.status(200).json({
      pendingHackathonsData
    })
  }catch(err){
    res.status(500).json({
      error : err.message
    })
  }  
}
export const updateHackathonPoint = async (req, res) => {
  try {
    const {adminId ,submissionId, points} = req.body; // auth middleware must set this
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

    // fetch the submission
    const submission = await SubmissionModel.findById(submissionId).lean();
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    // fetch hackathon to verify admin is creator
    const hackathonId = submission.hackathon;
    if (!hackathonId || !mongoose.Types.ObjectId.isValid(hackathonId)) {
      return res.status(500).json({ success: false, message: "Submission has invalid hackathon reference" });
    }

    const hackathon = await hackathonModel.findById(hackathonId).select("createdBy");
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon for this submission not found" });
    }

    // Only the hackathon creator can update points
    if (!hackathon.createdBy || hackathon.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update points for submissions of this hackathon",
      });
    }

    // perform the update and return updated doc
    const updated = await SubmissionModel.findByIdAndUpdate(
      submissionId,
      { $set: { hackathonPoints: points } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "hackathonPoints updated",
      submission: updated,
    });
  } catch (err) {
    console.error("updateHackathonPoint error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
export const getAdminDetails = async(req,res)=>{
  try{
    // const admin = req.admin;
    const admin = req.body;
    if (!admin) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.adminName ?? admin.name ?? null,
        email: admin.email,
        avatar: admin.avatar,
        contactNumber: admin.contactNumber,
        isVerified: admin.isVerified,
        controller: admin.controller,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        // include any other non-sensitive fields you want to expose
      },
    });
  }catch(err){
    console.error("getAdminProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}