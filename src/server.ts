import app from './app';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { connectDB } from './utils/database';

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(`=================================`);
      logger.info(`🚀 Server listening on port ${PORT}`);
      logger.info(`=================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

