import express from "express";
import RegisteredParticipantsModel from "../models/registeredParticipants.js";
import { isregistered, registerParicipants , registerTeam} from "../controllers/registration.controllers.js";


const router = express.Router();

// POST /api/register
router.post("/:hackathonId", registerParicipants);
router.post("/:hackathonId/team" , registerTeam);
router.get("/:hackathonId/:userId" , isregistered);
export default router;
