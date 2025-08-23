import express from "express"
import { joinTeam, handleRequests, searchTeamByCode, createTeam, getPendingRequests } from "../controllers/team.controllers.js";

const teamRoutes = express.Router();

teamRoutes.post("/create", createTeam);
teamRoutes.post("/join", joinTeam);
teamRoutes.get("/pendingRequests", getPendingRequests);
teamRoutes.post("/:teamId/handle", handleRequests);
teamRoutes.get("/search/:code", searchTeamByCode)


export default teamRoutes;