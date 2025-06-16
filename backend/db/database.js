import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URL) {
    throw new Error("mongoURL absent...")
}

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected....')
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

export default connectDB