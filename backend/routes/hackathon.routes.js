import express from 'express'
import { Router } from 'express'
import { sendHackathons,sendExpiredHackathons} from '../controllers/hackathon.controllers.js'

const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)
hackathonRoutes.get("/expiredHackathons",sendExpiredHackathons)
export default hackathonRoutes