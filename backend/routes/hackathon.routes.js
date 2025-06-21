import express from 'express'
import { Router } from 'express'
import { sendHackathons,sendInactiveHackathons} from '../controllers/hackathon.controllers.js'

const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)
hackathonRoutes.get("/inactiveHackathons",sendInactiveHackathons)
export default hackathonRoutes