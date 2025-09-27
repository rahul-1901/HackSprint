import express from 'express'
import { Router } from 'express'
import { checkAndUpdateGitHubStatus, saveGitHubLink, resetStreak, increaseStreak, devQuestionsAnsweredData, addConnectedApp, deleteConnectedApp, editConnectedApp, displayLeaderBoard, addEducation, editEducation, deleteEducation, addLanguage, removeLanguage, addSkill, deleteSkill } from '../controllers/user.controllers.js';
import { userAuth, verifyAuth } from '../middlewares/userAuth.js';
import jwt from 'jsonwebtoken'

const userRoutes = Router();

userRoutes.put("/save-gitHubLink", saveGitHubLink);
userRoutes.get("/submission/github-status", verifyAuth, checkAndUpdateGitHubStatus);
userRoutes.post("/correctanswer", increaseStreak);
userRoutes.post("/incorrectanswer", resetStreak);
userRoutes.post("/finishquiz", devQuestionsAnsweredData);
userRoutes.post("/addEducation", addEducation);
userRoutes.put("/editEducation", editEducation);
userRoutes.delete("/deleteEducation", deleteEducation);
userRoutes.post("/addConnectedApps", addConnectedApp);
userRoutes.put("/editConnectedApps", editConnectedApp);
userRoutes.delete("/deleteConnectedApps", deleteConnectedApp);
userRoutes.get("/leaderBoard", displayLeaderBoard);
userRoutes.post("/addLanguages", addLanguage);
userRoutes.delete("/deleteLanguages", removeLanguage);
userRoutes.post("/addSkills", addSkill);
userRoutes.delete("/deleteSkills", deleteSkill);

export default userRoutes;