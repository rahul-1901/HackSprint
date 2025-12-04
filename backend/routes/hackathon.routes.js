import express from "express";
import {
    getActiveHackathons,
    getExpiredHackathons,
    getUpcomingHackathons,
    getHackathonById,
    createHackathon
} from "../controllers/hackathon.controllers.js";

const router = express.Router();

// --- GET ROUTES FOR HACKATHON LISTS ---
router.get("/activeHackathons", getActiveHackathons);
router.get("/expiredHackathons", getExpiredHackathons);
router.get("/upcomingHackathons", getUpcomingHackathons);

// --- GET A SINGLE HACKATHON ---
router.get("/:id", getHackathonById);

// --- POST A NEW HACKATHON ---
// Note: This route is simplified. You might need to add multer middleware here for image uploads.
// router.post("/", createHackathon);

export default router;