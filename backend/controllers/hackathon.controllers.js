import mongoose from "mongoose"
import express from 'express'
import hackathonModel from "../models/hackathon.models.js"
import { all } from "axios"

export const sendHackathons = async (req,res,next) => {
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
export const sendExpiredHackathons = async (req,res,next) => {
    try {
        const allHackathons = await hackathonModel.find({
            status: false,
            endDate : {$lt : new Date(Date.now())}
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
