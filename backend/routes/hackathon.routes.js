import express from 'express'
import { Router } from 'express'
import { sendExpiredHackathons, sendHackathons,sendInactiveHackathons,addhackathons, sendDetailsOfId} from '../controllers/hackathon.controllers.js'

const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)
hackathonRoutes.get("/inactiveHackathons",sendInactiveHackathons)
hackathonRoutes.get("/expiredHackathons",sendExpiredHackathons)
hackathonRoutes.post("/hackathons",addhackathons);
hackathonRoutes.get("/:id", sendDetailsOfId);
export default hackathonRoutes