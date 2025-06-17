import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './db/database.js'
import hackathonRoutes from './routes/hackathon.routes.js'
import authRoutes from './routes/googleAuth.routes.js'

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors(
    {
        origin: '*'
    }
))

app.use("/api/hackathons", hackathonRoutes)
app.use("/api", authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
