
import TeamModel from "../models/team.js";
import UserModel from "../models/user.models.js";
import RegisteredParticipantsModel from "../models/registeredParticipants.js"
import hackathonModel from "../models/hackathon.models.js"



const generateCode = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create team with unique secret code
export const createTeam = async (req, res) => {
  try {

    const { name, leader, leaderName, leaderEmail, hackathon, contactNumber, city, state, workEmailAddress, yearsOfExperience } = req.body;


    // Generate unique secret code
    let code;
    let exists = true;
    while (exists) {
      code = generateCode(8);
      exists = await TeamModel.findOne({ secretCode: code });
    }

    const existingTeam = await TeamModel.findOne({
      name,
      hackathon
    });
    if (existingTeam) {
      return res
        .status(400)
        .json({ success: false, message: "Team name already taken" });
    }

    const alreadyRegisteredLeader = await RegisteredParticipantsModel.findOne({
      user: leader,
      hackathon: hackathon,
    });
    if (alreadyRegisteredLeader) {
      return res.status(400).json({
        success: false,
        message: "Leader already registered for this hackathon",
      });
    }


    const team = await TeamModel.create({
      name,
      leader,
      leaderName,
      leaderEmail,
      hackathon,
      members: [],
      secretCode: code,
      secretLink: `${process.env.FRONTEND_URL}/join/${code}` // optional link
    });

    await UserModel.findByIdAndUpdate(leader, {
      $addToSet: { registeredHackathons: hackathon, leaderOfHackathons: hackathon }
    });
    await hackathonModel.findByIdAndUpdate(hackathon, {
      $addToSet: { registeredParticipants: leader },
      $inc: { numParticipants: 1 },
    });

    await RegisteredParticipantsModel.create({
      user: leader,
      hackathon: hackathon,
      team: team._id || null,
      name: leaderName,
      contactNumber,
      yearsOfExperience,
      workEmailAddress,
      city,
      state,

    })
    res.status(201).json({
      secretCode: code,
      message: "Team created successfully",
      team
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      res.status(400).json({ message: "code is required!" });
    }

    const team = await TeamModel.findOne({ secretCode: code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.pendingMembers.includes(userId) || team.members.includes(userId)) {
      return res.status(400).json({ message: "Already requested or member" });
    }
    team.pendingMembers.push(userId);
    await team.save();

    res.json({ message: "Request sent to leader for approval" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const handleRequests = async (req, res) => {
  try {
    const { leaderId, userId, action } = req.body; // action = "accept" | "reject"

    // 1. Find leader's registration to get teamId
    const leaderRegistration = await RegisteredParticipantsModel.findOne({
      user: leaderId,
    });

    if (!leaderRegistration || !leaderRegistration.team) {
      return res.status(404).json({ message: "Leader or team not found" });
    }

    const teamId = leaderRegistration.team;

    // 2. Find team by teamId
    const team = await TeamModel.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // 3. Remove user from pending
    team.pendingMembers = team.pendingMembers.filter(
      (id) => id.toString() !== userId.toString()
    );

    // 4. If accepted
    if (action === "accept") {
      team.members.push(userId);
      await UserModel.findByIdAndUpdate(userId, { team: team._id });

      const hackathonId = team.hackathon;

      const alreadyRegisteredMember = await RegisteredParticipantsModel.findOne({
        user: userId,
        hackathon: hackathonId,
      });

      if (alreadyRegisteredMember) {
        return res.status(400).json({
          success: false,
          message: "Member already registered for this hackathon",
        });
      }
      // create registered participant entry for accepted member
      const userDoc = await UserModel.findById(userId);
      if (!userDoc) {
        return res.status(404).json({ message: "User not found" });
      }

      // create registered participant entry for accepted member
      await RegisteredParticipantsModel.create({
        user: userId,
        hackathon: hackathonId,
        team: team._id,
        name: userDoc.name || "",
        contactNumber: userDoc.contactNumber || "",
        email: userDoc.email || "",
        college: userDoc.college || "",
        gender: userDoc.gender || "",
        currentYearOfStudy: userDoc.currentYearOfStudy || "",
        city: userDoc.city || "",
        state: userDoc.state || "",
        yearsOfExperience: userDoc.yearsOfExperience || "",
        workEmailAddress: userDoc.workEmailAddress || "",
      });

      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { registeredHackathons: hackathonId },
      });

      await hackathonModel.findByIdAndUpdate(hackathonId, {
        $addToSet: { registeredParticipants: userId },
        $inc: { numParticipants: 1 },
      });
    }

    // 5. Save updated team
    await team.save();

    res.json({ message: `User ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const searchTeamByCode = async (req, res) => {
  try {
    const { secretCode } = req.params;

    const team = await TeamModel.findOne({ secretCode })
      .populate("leader")//, "name email")
      .populate("members")//, "name email rollNo phone branch year")   // populate members
      .populate("pendingMembers")//, "name email rollNo phone branch year"); // populate pending requests

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({
      message: "Team found successfully",
      team: {
        id: team._id,
        name: team.name,
        code: team.secretCode,
        leader: team.leader,
        members: team.members,
        pendingMembers: team.pendingMembers,
        membersCount: team.members.length,
        pendingRequestsCount: team.pendingMembers.length,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        secretLink: team.secretLink,
        maxTeamSize: team.maxTeamSize
      },
    });
  } catch (error) {
    console.error("Error searching team:", error);
    res.status(500).json({
      message: "Something went wrong while searching the team!",
      error: error.message,
    });
  }
};


export const getPendingRequests = async (req, res) => {
  try {
    const { leaderId } = req.body;

    const leaderRegistration = await RegisteredParticipantsModel.findOne({
      user: leaderId
    });

    if (!leaderRegistration || !leaderRegistration.team) {
      return res.status(404).json({ message: "Leader or team not found" });
    }

    const teamId = leaderRegistration.team;

    // 2. Find team by teamId
    const team = await TeamModel.findById(teamId).populate("pendingMembers");
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team.pendingMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find team by ID
export const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await TeamModel.findById(teamId)
      .populate("leader")
      .populate("members")
      .populate("pendingMembers")
      .populate("hackathon")

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({
      message: "Team found successfully",
      team: {
        id: team._id,
        name: team.name,
        code: team.secretCode,
        leader: team.leader,
        members: team.members,
        pendingMembers: team.pendingMembers,
        membersCount: team.members.length,
        pendingRequestsCount: team.pendingMembers.length,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        secretLink: team.secretLink,
        maxTeamSize: team.maxTeamSize,
        hackathon: team.hackathon
      },
    });
  } catch (error) {
    console.error("Error fetching team by ID:", error);
    res.status(500).json({
      message: "Something went wrong while fetching the team!",
      error: error.message,
    });
  }
};
