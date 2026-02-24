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
    getHackathonGallery
} from "../controllers/hackathon.controllers.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// --- GET ROUTES FOR HACKATHON LISTS ---
router.get("/activeHackathons", getActiveHackathons);
router.get("/expiredHackathons", getExpiredHackathons);
router.get("/upcomingHackathons", getUpcomingHackathons);

// --- GET A SINGLE HACKATHON ---
router.get("/:id", getHackathonById);
router.get("/:id/results", getHackathonResults);

// --- GALLERY ROUTES ---
router.get("/:hackathonId/gallery", getHackathonGallery);
router.post("/:hackathonId/gallery", upload.array("images", 10), addGalleryImages);
router.delete("/:hackathonId/gallery/:imageId", deleteGalleryImage);

// --- POST A NEW HACKATHON ---
// Note: This route is simplified. You might need to add multer middleware here for image uploads.
// router.post("/", createHackathon);

export default router;