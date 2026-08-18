import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(connectionString);
    isConnected = true;
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn(
      'MongoDB connection unavailable. Continuing without a database connection.',
      error instanceof Error ? error.message : error,
    );
  }
};

connectToDatabase();

db.on('error', (error) => {
  isConnected = false;
  console.error('MongoDB connection error:', error);
});

export default db;
