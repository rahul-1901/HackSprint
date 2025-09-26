import hackathonModel from "../models/hackathon.models.js";
import cloudinary from "../config/cloudinary.js";

// --- GET ACTIVE HACKATHONS ---
// Finds hackathons where the current date is between the start and end dates.
export const getActiveHackathons = async (req, res) => {
  try {
    const now = new Date();
    const allHackathons = await hackathonModel.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ endDate: 1 }); // Sort by ending soonest

    res.status(200).json({ allHackathons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active hackathons", error: error.message });
  }
};

// --- GET EXPIRED HACKATHONS ---
// Finds hackathons where the end date is in the past.
export const getExpiredHackathons = async (req, res) => {
  try {
    const now = new Date();
    const expiredHackathons = await hackathonModel.find({
      status: false,
      // submissionEndDate: { $lt: currentTime },
    });
    res.status(200).json({
      expiredHackathons,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expired hackathons", error: error.message });
  }
};

// --- GET UPCOMING HACKATHONS ---
// Finds hackathons where the start date is in the future.
export const getUpcomingHackathons = async (req, res) => {
  try {
    const now = new Date();
    const upcomingHackathons = await hackathonModel.find({
      startDate: { $gt: now },
    }).sort({ startDate: 1 }); // Sort by starting soonest

    res.status(200).json({ upcomingHackathons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming hackathons", error: error.message });
  }
};

// --- GET HACKATHON BY ID ---
export const getHackathonById = async (req, res) => {
  try {
    const hackathon = await hackathonModel.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    return res.json(hackathon);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- CREATE HACKATHON (from your existing file) ---
export const createHackathon = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hackathons"
      });
      imageUrl = result.secure_url;
    }

    const hackathonData = new hackathonModel({
      ...req.body,
      image: imageUrl,
      createdBy: req.body.adminId // Assuming adminId is passed
    });

    await hackathonData.save();

    res.status(201).json({
      message: "Hackathon Added Successfully",
      data: hackathonData,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};