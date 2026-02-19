// dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URL;

const connectdb = async () => {
  try {
    await mongoose.connect(url);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

export default connectdb
