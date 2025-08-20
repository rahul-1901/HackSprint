import express from "express";
import { verifyAuth } from "../middlewares/userAuth.js";
import { githubAuthLogin, githubTokenExchange } from "../controllers/github.controllers.js";

const router = express.Router();


router.get("/auth/github/callback", verifyAuth, githubAuthLogin);

router.get("/auth/github/verify", verifyAuth, githubTokenExchange);

export default router;
