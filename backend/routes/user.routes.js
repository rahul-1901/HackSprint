import express from 'express'
import { Router } from 'express'
import { checkAndUpdateGitHubStatus, saveGitHubLink,resetStreak , increaseStreak, devQuestionsAnsweredData,updatingEducation ,updatingConnectedApps, displayLeaderBoard} from '../controllers/user.controllers.js';
import { verifyAuth } from '../middlewares/userAuth.js';
import jwt from 'jsonwebtoken'

const userRoutes = Router();

// // MANUALLY GENERATING TEST TOKEN 
// userRoutes.post("/generate-test-token", (req, res) => {
//     const payload = {
//         _id: "6898c93d632500c60a07b840",
//         email: "b24ee1044@iitj.ac.in"
//     };

//     const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

//     res.json({
//         success: true,
//         token
//     });
// });

userRoutes.put("/save-gitHubLink" ,saveGitHubLink)
userRoutes.get("/submission/github-status", verifyAuth, checkAndUpdateGitHubStatus);
userRoutes.post("/correctanswer" , increaseStreak);
userRoutes.post("/incorrectanswer" , resetStreak);
userRoutes.post("/finishquiz" , devQuestionsAnsweredData );
userRoutes.patch("/updateEducation" , updatingEducation);
userRoutes.patch("/updateConnectedApps" , updatingConnectedApps);
userRoutes.get("/leaderBoard" , displayLeaderBoard);
export default userRoutes;