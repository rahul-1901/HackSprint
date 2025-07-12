import express from 'express'
import { Router } from 'express'
import { sendExpiredHackathons, sendHackathons,sendInactiveHackathons} from '../controllers/hackathon.controllers.js'

const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)
hackathonRoutes.get("/inactiveHackathons",sendInactiveHackathons)
hackathonRoutes.get("/expiredHackathons",sendExpiredHackathons)
export default hackathonRoutes