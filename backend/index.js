import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/database.js'
import hackathonRoutes from './routes/hackathon.routes.js'
import oauthRoutes from './routes/googleAuth.routes.js'
import authRoutes from "./routes/auth.route.js"

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors())

app.use("/api/hackathons", hackathonRoutes)
app.use("/api", oauthRoutes)
app.use("/api/account", authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
