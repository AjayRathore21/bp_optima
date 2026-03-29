import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// Redis connection instance
export const connection = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null, // Critical for BullMQ
});

// Configure the "document-processing" queue
export const documentQueue = new Queue('document-processing', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: {
        age: 24 * 3600, // keep for 24 hours
        count: 1000
    }
  },
});

const queueEvents = new QueueEvents('document-processing', { connection });

queueEvents.on('completed', ({ jobId }) => {
  logger.info(`Job ${jobId} completed successfully`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Job ${jobId} failed: ${failedReason}`);
});

/**
 * Helper function to add a job to the queue
 */
export const addJobToQueue = async (jobId: string, fileUrl?: string) => {
  try {
    await documentQueue.add('process-document', {
      jobId,
      fileUrl,
    }, {
      jobId, // ensure task identity matches MongoDB _id
    });
    logger.info(`Job ${jobId} added to the "document-processing" queue`);
  } catch (error) {
    logger.error(`Failed to add job ${jobId} to queue:`, error);
    throw error;
  }
};
