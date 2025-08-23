import express from "express"
import { joinTeam, handleRequests, searchTeamByCode, createTeam, getPendingRequests } from "../controllers/team.controllers.js";

const teamRoutes = express.Router();

teamRoutes.post("/create", createTeam);
teamRoutes.post("/join", joinTeam);
teamRoutes.post("/pendingRequests", getPendingRequests);

teamRoutes.post("/handleRequest", handleRequests);

teamRoutes.get("/search/:secretCode", searchTeamByCode)

export default teamRoutes;