// controllers/hackathon.controller.js
import hackathonModel from "../models/hackathon.models.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/aws.js";
import SubmissionModel from "../models/submission.js";
import UserModel from "../models/user.models.js";
import fs from "fs";
import { getNowUTC } from "../utils/dateUtils.js";
// import cloudinary from "../config/cloudinary.js"; // COMMENTED OUT - REPLACED WITH AWS S3

// --- GET ACTIVE HACKATHONS ---
// Finds hackathons where the current date (UTC) is between the start and end dates.
export const getActiveHackathons = async (req, res) => {
  try {
    const now = getNowUTC(); // ✅ Always use UTC
    const allHackathons = await hackathonModel.find({
      startDate: { $lte: now },
      submissionEndDate: { $gte: now },
    }).sort({ endDate: 1 }); // Sort by ending soonest

    res.status(200).json({ allHackathons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active hackathons", error: error.message });
  }
};

// ─── Helper: upload a single file to S3 and clean up temp ────────────────────
const uploadFileToS3 = async (file, s3KeyPrefix) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const key = `${s3KeyPrefix}/${timestamp}-${randomString}-${file.originalname}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fs.readFileSync(file.path),
    ContentType: file.mimetype,
  });

  await s3Client.send(putObjectCommand);

  // Clean up temp file
  if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { key, url };
};

// ─── Helper: parse JSON-stringified array fields from FormData ────────────────
const parseArrayFields = (body) => {
  const arrayFields = [
    "category", "techStackUsed", "themes", "FAQs",
    "problems", "TandCforHackathon", "evaluationCriteria",
    "projectSubmission", "teams", "registeredParticipants",
  ];

  const parsed = { ...body };
  arrayFields.forEach((field) => {
    if (parsed[field] && typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch {
        parsed[field] = [];
      }
    }
  });
  return parsed;
};

// --- GET ACTIVE HACKATHONS ---
// export const getActiveHackathons = async (req, res) => {
//   try {
//     const now = new Date();
//     const allHackathons = await hackathonModel
//       .find({ startDate: { $lte: now }, submissionEndDate: { $gte: now } })
//       .sort({ endDate: 1 });
//     res.status(200).json({ allHackathons });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching active hackathons", error: error.message });
//   }
// };

// --- GET EXPIRED HACKATHONS ---
// Finds hackathons where the end date is in the past (UTC).
export const getExpiredHackathons = async (req, res) => {
  try {
    const now = getNowUTC(); // ✅ Always use UTC
    const expiredHackathons = await hackathonModel.find({
      status: false,
      submissionEndDate: { $lt: now },
    });
    res.status(200).json({ expiredHackathons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expired hackathons", error: error.message });
  }
};

// --- GET UPCOMING HACKATHONS ---
// Finds hackathons where the start date is in the future (UTC).
export const getUpcomingHackathons = async (req, res) => {
  try {
    const now = getNowUTC(); // ✅ Always use UTC
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
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    return res.json(hackathon);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- CREATE HACKATHON ---
// Expects multer.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 10 }])
export const createHackathon = async (req, res) => {
  const tempFiles = []; // track all temp files for cleanup on error

  try {
    // ── 1. Upload banner image ───────────────────────────────────────────────
    let imageUrl = "";

    const bannerFile = req.files?.image?.[0];
    if (bannerFile) {
      tempFiles.push(bannerFile.path);
      const { url } = await uploadFileToS3(bannerFile, "hackathons/images");
      imageUrl = url;
    }

    // ── 2. Upload gallery images ─────────────────────────────────────────────
    const galleryFiles = req.files?.gallery || [];
    const galleryImages = [];

    for (const file of galleryFiles) {
      tempFiles.push(file.path);
      const { url } = await uploadFileToS3(
        file,
        `hackathons/gallery`
      );
      galleryImages.push(url); // Just store the URL string
    }

    // ── 3. Parse array fields ────────────────────────────────────────────────
    const parsedBody = parseArrayFields(req.body);

    // ── 4. Save to DB ────────────────────────────────────────────────────────
    const hackathonData = new hackathonModel({
      ...parsedBody,
      image: imageUrl,
      gallery: galleryImages,
      createdBy: req.body.adminId,
    });

    await hackathonData.save();

    res.status(201).json({
      message: "Hackathon Added Successfully",
      hackathon: hackathonData, // key must be "hackathon" so frontend gallery upload finds ._id
    });
  } catch (err) {
    // Clean up any temp files that didn't get deleted yet
    tempFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    });

    console.error("Create hackathon error:", err);
    res.status(400).json({ error: err.message });
  }
};

// --- GET HACKATHON RESULTS ---
export const getHackathonResults = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await SubmissionModel.find({ hackathon: id })
      .sort({ hackathonPoints: -1 })
      .limit(5)
      .populate("participant", "name avatar email")
      .populate("team", "name members");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};

// --- ADD IMAGES TO GALLERY (separate endpoint for post-creation uploads) ---
// Expects multer.array("image", 10)
export const addGalleryImages = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // Upload images and get URLs
    const uploadPromises = req.files.map(async (file) => {
      const { url } = await uploadFileToS3(
        file,
        `hackathons/${hackathonId}/gallery`
      );
      return url; // Just return the URL string
    });

    const newImageUrls = await Promise.all(uploadPromises);
    
    // Push URL strings to gallery array
    hackathon.gallery.push(...newImageUrls);
    await hackathon.save();

    res.status(200).json({
      message: "Images added to gallery successfully",
      gallery: hackathon.gallery,
    });
  } catch (error) {
    console.error("Add gallery images error:", error);
    res.status(500).json({ message: "Error adding images to gallery", error: error.message });
  }
};

// --- DELETE IMAGE FROM GALLERY ---
export const deleteGalleryImage = async (req, res) => {
  try {
    const { hackathonId, imageId } = req.params;

    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // imageId is actually the index in the array
    const imageIndex = parseInt(imageId);
    if (imageIndex < 0 || imageIndex >= hackathon.gallery.length) {
      return res.status(404).json({ message: "Image not found in gallery" });
    }

    const imageUrl = hackathon.gallery[imageIndex];
    
    // Extract S3 key from URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/key
    try {
      const urlParts = new URL(imageUrl);
      const s3Key = urlParts.pathname.substring(1); // Remove leading slash
      
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
      }));
    } catch (s3Error) {
      console.error("S3 deletion error:", s3Error);
      // Continue even if S3 deletion fails
    }

    hackathon.gallery.splice(imageIndex, 1);
    await hackathon.save();

    res.status(200).json({ message: "Image deleted from gallery successfully", gallery: hackathon.gallery });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    res.status(500).json({ message: "Error deleting image from gallery", error: error.message });
  }
};

// --- GET HACKATHON GALLERY ---
export const getHackathonGallery = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await hackathonModel.findById(hackathonId).select("gallery");
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
    res.status(200).json({ success: true, gallery: hackathon.gallery || [] });
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({ message: "Error fetching gallery", error: error.message });
  }
};

// --- TOGGLE HACKATHON WISHLIST ---
export const toggleHackathonWishlist = async (req, res) => {
  try {
    const { hackathonId } = req.body;
    const userId = req.userId || req.body.userId; // Try req.userId first

    if (!hackathonId) return res.status(400).json({ message: "Hackathon ID is required", success: false });
    if (!userId) return res.status(401).json({ message: "User not authenticated", success: false });

    const hackathon = await hackathonModel.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found", success: false });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const wishlistIndex = user.wishlist.indexOf(hackathonId);
    if (wishlistIndex > -1) {
      user.wishlist.splice(wishlistIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist", success: true, liked: false });
    } else {
      user.wishlist.push(hackathonId);
      await user.save();
      return res.status(201).json({ message: "Added to wishlist", success: true, liked: true });
    }
  } catch (error) {
    console.error("Toggle hackathon wishlist error:", error);
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
};

// --- GET USER WISHLIST ---
export const getUserHackathonWishlist = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId; // Try req.userId first
    
    if (!userId) {
      return res.status(401).json({ 
        message: "User not authenticated", 
        success: false 
      });
    }

    const user = await UserModel.findById(userId).populate({
      path: "wishlist",
      select: "title subTitle description image startDate endDate submissionStartDate submissionEndDate prizeMoney difficulty category techStackUsed themes status",
    });

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const likedHackathons = user.wishlist.filter((h) => h !== null);
    return res.status(200).json({ success: true, likedHackathons, count: likedHackathons.length });
  } catch (error) {
    console.error("Get user hackathon wishlist error:", error);
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
};

// --- CHECK IF HACKATHON IS LIKED ---
export const checkHackathonLiked = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.userId || req.body?.userId; // Try req.userId first, fallback to req.body.userId

    if (!userId) {
      return res.status(401).json({ 
        message: "User not authenticated", 
        success: false 
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    return res.status(200).json({ success: true, liked: user.wishlist.includes(hackathonId) });
  } catch (error) {
    console.error("Check hackathon liked error:", error);
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
};