import express from "express";
import { getMyHackathon, deleteHackathon, editHackathon, getAllHackathons,getalladmin,createPendingHackathon, approveHackathon, rejectHackathon, displayPendingHackathon,updateHackathonPoint, getAdminDetails} from "../controllers/admin.controllers.js";
import upload from "../middlewares/multer1.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminLogin, adminSignup, adminGoogleLogin } from "../controllers/adminAuth.controllers.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

export const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many login attempts. Try again later.",
  });

export const googleLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many Google login attempts. Try again later.",
  });

router.get("/" , getalladmin);
router.post("/signup", adminSignup);
router.post("/login", adminLoginLimiter, adminLogin);
router.get("/google", googleLimiter, adminGoogleLogin);
router.get("/adminDetails" , adminAuth, getAdminDetails);
router.post("/my-hackathons", getAllHackathons);
router.post("/my-hackathon-detail", getMyHackathon);
router.post("/createHackathon",upload.single("image"), createPendingHackathon);
router.post("/approveHackathon", approveHackathon);
router.post("/rejectHackathon" , rejectHackathon);
router.get("/pendingHackathon/:adminId", displayPendingHackathon);
router.post("/HackathonPoints" , updateHackathonPoint);
router.post("/editHackathon",   adminAuth, upload.single("image"), editHackathon);
router.delete("/deleteHackathon", adminAuth, deleteHackathon);
export default router;
