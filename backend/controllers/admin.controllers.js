import hackathonModel from "../models/hackathon.models.js";
import SubmissionModel from "../models/submission.js";
import RegisteredParticipantsModel from "../models/registeredParticipants.js";
import Admin from "../models/admin.model.js";

// Get all hackathons created by logged-in admin
export const getAllHackathons = async(req,res)=>{
  try{
    const {adminId} = req.body;
    const hackathons = await hackathonModel.find({ "createdBy" : adminId});
    res.json(hackathons);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
// export const getMyHackathon = async (req, res) => {
//   try {
//     const { adminId ,hackathonId} = req.body;
//     const hackathon = await hackathonModel
//       .findOne({"_id": hackathonId, "createdBy": adminId})
//       .populate(
//         "registeredParticipants",
//         "name email gender createdAt contactNumber"
//       )
//       .populate("teams", "name members")
//       .populate(
//         "submissions",
//         "repoUrl githubMetadata docs images videos submittedAt"
//       );
//     res.json(hackathon);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
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
      .select("repoUrl githubMetadata docs images videos submittedAt")
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
export const getalladmin = async(req,res)=>{
  try{
    const admindetails = await Admin.find();
    res.status(200).json({
      admindetails
    })
  }catch(err){
    res.status(404).json({
      "message" : err.message
    })
  }
}