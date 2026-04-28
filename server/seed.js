import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runSeed } from './utils/seedData.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return runSeed();
  })
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during seed:', err);
    process.exit(1);
  });