// routes/hackathon.routes.js
import express from "express";
import {
  getActiveHackathons,
  getExpiredHackathons,
  getUpcomingHackathons,
  getHackathonById,
  createHackathon,
  getHackathonResults,
  addGalleryImages,
  deleteGalleryImage,
  getHackathonGallery,
  toggleHackathonWishlist,
  getUserHackathonWishlist,
  checkHackathonLiked,
} from "../controllers/hackathon.controllers.js";

import {
  uploadHackathonImages, // fields([ image x1, gallery x10 ]) — for createHackathon
  uploadGalleryImages,   // array("image", 10)               — for addGalleryImages
} from "../middlewares/Multerhackathon.js";

import { verifyAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/activeHackathons", getActiveHackathons);
router.get("/expiredHackathons", getExpiredHackathons);
router.get("/upcomingHackathons", getUpcomingHackathons);

// ── Wishlist (requires user auth) ─────────────────────────────────────────────
router.post("/wishlist/toggle", verifyAuth, toggleHackathonWishlist);
router.get("/wishlist", verifyAuth, getUserHackathonWishlist);
router.get("/wishlist/check/:hackathonId", verifyAuth, checkHackathonLiked);

// ── Specific hackathon routes (must come AFTER specific named routes) ─────────
router.get("/:id", getHackathonById);
router.get("/:id/results", getHackathonResults);
router.get("/:hackathonId/gallery", getHackathonGallery);

// ── Admin routes ──────────────────────────────────────────────────────────────

// CREATE: handles both banner ("image" field) AND gallery ("gallery" field) in one request
router.post("/", uploadHackathonImages, createHackathon);

// GALLERY: add images to an existing hackathon's gallery after creation
router.post("/:hackathonId/gallery", uploadGalleryImages, addGalleryImages);

// DELETE gallery image
router.delete("/:hackathonId/gallery/:imageId", deleteGalleryImage);

export default router;