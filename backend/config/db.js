// ============================================
// MongoDB Connection Configuration
// ============================================
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('📦 Using existing MongoDB connection');
    return;
  }

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codereview-ai';

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Mongoose 8 uses these defaults, but we set them explicitly
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
