import mongoose from "mongoose"
import express from 'express'
import devquestModel from "../models/devquest.model.js"
import {all} from "axios"

export const sendQandA = async(req,res)=>{
    try{
        const allQandA = await devquestModel.find();
        res.status(200).json({
            "Questions&Answer" : allQandA
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}