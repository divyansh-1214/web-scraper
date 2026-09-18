import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();
const DB_URL = process.env.MONGODB_URI ?? "";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(DB_URL);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error}`);
    process.exit(1);
  }
};

export { connectDB };
