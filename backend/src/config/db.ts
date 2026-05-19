import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`🚀 MongoDB Connected Sync: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Database Connection Error: ${(error as Error).message}`);
    process.exit(1); // Force terminate application if database is inaccessible
  }
};