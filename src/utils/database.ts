import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      logger.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    const { connection } = await mongoose.connect(mongoURI);

    logger.info(`=================================`);
    logger.info(`🍃 MongoDB Connected: ${connection.host}`);
    logger.info(`=================================`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
