import VoteModel from "../models/vote.model.js";
import SubmissionModel from "../models/submission.js";
import UserModel from "../models/user.models.js";

// Toggle vote (add or remove)
export const toggleVote = async (req, res) => {
  try {
    const { submissionId, hackathonId } = req.body;
    const userId = req.body.userId; // This will come from the userAuth middleware

    if (!submissionId || !hackathonId) {
      return res.status(400).json({
        message: "Submission ID and Hackathon ID are required",
        success: false,
      });
    }

    // Check if submission exists
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
        success: false,
      });
    }

    // Check if vote already exists
    const existingVote = await VoteModel.findOne({
      submission: submissionId,
      user: userId,
    });

    if (existingVote) {
      // Remove vote
      await VoteModel.findByIdAndDelete(existingVote._id);
      return res.status(200).json({
        message: "Vote removed",
        success: true,
        voted: false,
      });
    } else {
      // Add vote
      const newVote = await VoteModel.create({
        submission: submissionId,
        user: userId,
        hackathon: hackathonId,
      });

      return res.status(201).json({
        message: "Vote added",
        success: true,
        voted: true,
        vote: newVote,
      });
    }
  } catch (error) {
    console.error("Toggle vote error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Get votes for a specific hackathon (with submission details and vote counts)
export const getHackathonVotes = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    if (!hackathonId) {
      return res.status(400).json({
        message: "Hackathon ID is required",
        success: false,
      });
    }

    // Get all submissions for this hackathon with their vote counts
    const submissions = await SubmissionModel.find({ hackathon: hackathonId })
      .populate("team", "name")
      .populate("participant", "name email")
      .lean();

    // Get vote counts for each submission
    const submissionsWithVotes = await Promise.all(
      submissions.map(async (submission) => {
        const voteCount = await VoteModel.countDocuments({
          submission: submission._id,
        });

        return {
          ...submission,
          voteCount,
        };
      })
    );

    // Sort by vote count (descending)
    submissionsWithVotes.sort((a, b) => b.voteCount - a.voteCount);

    return res.status(200).json({
      success: true,
      submissions: submissionsWithVotes,
    });
  } catch (error) {
    console.error("Get hackathon votes error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Get user's votes for a specific hackathon
export const getUserVotes = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.body.userId; // From userAuth middleware

    if (!hackathonId) {
      return res.status(400).json({
        message: "Hackathon ID is required",
        success: false,
      });
    }

    const userVotes = await VoteModel.find({
      user: userId,
      hackathon: hackathonId,
    }).select("submission");

    const votedSubmissionIds = userVotes.map((vote) => vote.submission.toString());

    return res.status(200).json({
      success: true,
      votedSubmissions: votedSubmissionIds,
    });
  } catch (error) {
    console.error("Get user votes error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Get vote count for a specific submission
export const getSubmissionVoteCount = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({
        message: "Submission ID is required",
        success: false,
      });
    }

    const voteCount = await VoteModel.countDocuments({
      submission: submissionId,
    });

    return res.status(200).json({
      success: true,
      voteCount,
    });
  } catch (error) {
    console.error("Get submission vote count error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Get all liked submissions for a user (wishlist)
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.body.userId; // From userAuth middleware

    console.log("=== WISHLIST REQUEST ===");
    console.log("Fetching wishlist for user:", userId);

    // Find all votes by this user
    const userVotes = await VoteModel.find({ user: userId })
      .populate({
        path: "submission",
        populate: [
          { path: "team", select: "name" },
          { path: "participant", select: "name email" },
          { path: "hackathon", select: "title subTitle image startDate endDate" }
        ]
      })
      .sort({ createdAt: -1 }); // Most recently liked first

    console.log("Found total votes:", userVotes.length);
    
    // Log each vote to see what's populated
    userVotes.forEach((vote, index) => {
      console.log(`Vote ${index + 1}:`, {
        voteId: vote._id,
        hasSubmission: !!vote.submission,
        submissionId: vote.submission?._id,
        hasHackathon: !!vote.submission?.hackathon,
        hackathonTitle: vote.submission?.hackathon?.title,
        teamName: vote.submission?.team?.name,
        participantName: vote.submission?.participant?.name,
      });
    });

    // Filter out any votes where submission was deleted
    const validVotes = userVotes.filter(vote => vote.submission);

    console.log("Valid votes after filtering:", validVotes.length);

    // Format the response
    const likedSubmissions = validVotes.map(vote => ({
      _id: vote.submission._id,
      hackathon: vote.submission.hackathon, // Use submission's hackathon, not vote's
      teamName: vote.submission.team?.name || null,
      participantName: vote.submission.participant?.name || null,
      participantEmail: vote.submission.participant?.email || null,
      repoUrl: vote.submission.repoUrl,
      docs: vote.submission.docs || [],
      videos: vote.submission.videos || [],
      images: vote.submission.images || [],
      submittedAt: vote.submission.submittedAt,
      hackathonPoints: vote.submission.hackathonPoints || 0,
      likedAt: vote.createdAt,
    }));

    console.log("Formatted submissions:", likedSubmissions.length);
    console.log("Sample submission:", likedSubmissions[0]);
    console.log("=== END WISHLIST REQUEST ===");

    return res.status(200).json({
      success: true,
      likedSubmissions,
      count: likedSubmissions.length
    });
  } catch (error) {
    console.error("Get user wishlist error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
