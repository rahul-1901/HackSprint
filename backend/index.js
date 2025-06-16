import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000
