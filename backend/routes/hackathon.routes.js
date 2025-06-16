import express from 'express'
import { Router } from 'express'
import { sendHackathons } from '../controllers/hackathon.controllers.js'

const hackathonRoutes = Router();

hackathonRoutes.get("/", sendHackathons)

export default hackathonRoutes