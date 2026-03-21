import express from "express";
import { getMyHackathon, deleteHackathon, editHackathon, getAllHackathons,getalladmin,createPendingHackathon, approveHackathon, rejectHackathon, displayPendingHackathon,updateHackathonPoint, getAdminDetails} from "../controllers/admin.controllers.js";
import upload from "../middlewares/multer1.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminLogin, adminSignup } from "../controllers/adminAuth.controllers.js";

const router = express.Router();

router.get("/" , getalladmin);
router.post("/signup", adminSignup);
router.post("/login", adminLogin);
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
