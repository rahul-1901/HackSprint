import hackathonModel from "../models/hackathon.models.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/aws.js";
import SubmissionModel from "../models/submission.js";
import fs from "fs";
// import cloudinary from "../config/cloudinary.js"; // COMMENTED OUT - REPLACED WITH AWS S3

// --- GET ACTIVE HACKATHONS ---
// Finds hackathons where the current date is between the start and end dates.
export const getActiveHackathons = async (req, res) => {
  try {
    const now = new Date();
    const allHackathons = await hackathonModel.find({
      startDate: { $lte: now },
      submissionEndDate: { $gte: now },
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
      submissionEndDate: { $lt: now },
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
      try {
        // ✅ AWS S3 Upload
        const fileContent = fs.readFileSync(req.file.path);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const key = `hackathons/images/${timestamp}-${randomString}-${req.file.originalname}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType: req.file.mimetype,
        });

        await s3Client.send(putObjectCommand);
        imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Error uploading to AWS S3:", error);
        throw new Error(`File upload failed: ${error.message}`);
      }
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

/* ✅ OLD CLOUDINARY CODE (COMMENTED OUT)
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
*/

// --- GET HACKATHON RESULTS ---
export const getHackathonResults = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await SubmissionModel.find({ hackathon: id })
      .sort({ hackathonPoints: -1 }) // Sort by points descending
      .limit(5)
      .populate("participant", "name avatar email") // Populate user details
      .populate("team", "name members"); // Populate team details

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};