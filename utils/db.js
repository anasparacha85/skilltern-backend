// dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URL;

const connectdb = async () => {
  try {
    await mongoose.connect(url);
    console.log('Database has been successfully connected to the server !!!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

export default connectdb
