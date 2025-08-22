import mongoose from "mongoose"
import express from 'express'
import UserModel from "../models/user.models.js"
import hackathonModel from "../models/hackathon.models.js"
import TeamModel from "../models/team.js"
import RegisteredParticipantsModel from "../models/registeredParticipants.js"
import { all } from "axios"


const generateCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Create team with unique secret code
export const createTeam = async (req, res) => {
    try {
        const { name, leader, leaderName, leaderEmail, hackathon } = req.body;

        // Generate unique secret code
        let code;
        let exists = true;
        while (exists) {
            code = generateCode(8);
            exists = await TeamModel.findOne({ secretCode: code });
        }

        const team = await TeamModel.create({
            name,
            leader,
            leaderName,
            leaderEmail,
            hackathon,
            members,
            secretCode: code,
            secretLink: `${process.env.BASE_URL}/join/${code}` // optional link
        });

        const existingTeam = await TeamModel.findOne({
            name,
            hackathon
        });
        if (existingTeam) {
            return res
                .status(400)
                .json({ success: false, message: "Team name already taken" });
        }
        
        const alreadyRegisteredLeader = await RegisteredParticipantsModel.findOne({
            user: leader,
            hackathon: hackathon,
        });
        if (alreadyRegisteredLeader) {
            return res.status(400).json({
                success: false,
                message: "Leader already registered for this hackathon",
            });
        }
        await UserModel.findByIdAndUpdate(leader, {
            $addToSet: { registeredHackathons: hackathon },
        });
        await hackathonModel.findByIdAndUpdate(hackathon, {
            $addToSet: { registeredParticipants: leader },
            $inc: { numParticipants: 1 },
        });
        res.status(201).json({
            message: "Team created successfully",
            team
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

