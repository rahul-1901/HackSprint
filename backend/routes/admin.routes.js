import express from "express";
import { getMyHackathon, getAllHackathons,getalladmin } from "../controllers/admin.controllers.js";
// import { adminAuth } from "../middlewares/adminAuth.js";
// import { adminLogin, adminSignup } from "../controllers/adminAuth.controllers.js";

const router = express.Router();

router.get("/" , getalladmin);
// router.post("/signup", adminSignup);
// router.post("/login", adminLogin);
router.post("/my-hackathons", getAllHackathons);
router.post("/my-hackathon-detail", getMyHackathon);

export default router;
