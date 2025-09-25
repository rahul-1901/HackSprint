import express from "express";
import { getMyHackathon, getAllHackathons,getalladmin,createPendingHackathon, approveHackathon, rejectHackathon, displayPendingHackathon,updateHackathonPoint, getAdminDetails} from "../controllers/admin.controllers.js";
// import { addhackathons } from "../controllers/hackathon.controllers.js";
import upload from "../middlewares/multer1.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminLogin, adminSignup } from "../controllers/adminAuth.controllers.js";

const router = express.Router();

router.get("/" , getalladmin);
router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/adminDetails" , adminAuth, getAdminDetails);
// router.post("/adminDetails" , getAdminDetails);
router.post("/my-hackathons", getAllHackathons);
router.post("/my-hackathon-detail", getMyHackathon);
router.post("/createHackathon",upload.single("image"), createPendingHackathon);
router.post("/approveHackathon", approveHackathon);
router.post("/rejectHackathon" , rejectHackathon);
router.get("/pendingHackathon", displayPendingHackathon);
router.post("/HackathonPoints" , updateHackathonPoint);
export default router;
