import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error("mongoURL absent...");
}

// --- Cached connection for Vercel/Serverless ---
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new database connection...');
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Database connected....');
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }

  return cached.conn;
};

export default connectDB;