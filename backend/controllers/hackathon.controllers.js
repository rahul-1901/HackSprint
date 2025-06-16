import mongoose from "mongoose"
import express from 'express'
import hackathonModel from "../models/hackathon.models.js"

export const sendHackathons = async () => {
    try {
        const allHackathons = hackathonModel.find({
            status: true
        })
        res.status(200).json({
            allHackathons
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })     
    }
}
