import express from 'express'
import { Router } from 'express'
import upload from "../middlewares/multer1.js"

import { sendExpiredHackathons, sendHackathons,sendInactiveHackathons,addhackathons,sendUpcomingHackathons,sendDetailsOfId} from '../controllers/hackathon.controllers.js'
const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)
hackathonRoutes.get("/inactiveHackathons",sendInactiveHackathons)
hackathonRoutes.get("/expiredHackathons",sendExpiredHackathons)

hackathonRoutes.get("/upcomingHackathons",sendUpcomingHackathons)
hackathonRoutes.get("/:id", sendDetailsOfId);
hackathonRoutes.post("/hackathons",upload.single("image"), addhackathons);

export default hackathonRoutes