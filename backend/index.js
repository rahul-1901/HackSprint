import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose, { connect } from 'mongoose'
import connectDB from './db/database.js'
import hackathonRoutes from './routes/hackathon.routes.js'

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:5173/'
    }
))

app.use("/api/hackathons", hackathonRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
