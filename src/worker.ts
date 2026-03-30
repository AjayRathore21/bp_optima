import { Worker, Job } from 'bullmq';
import JobService from './services/job.service';
import { connection } from './queue/queue';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';

dotenv.config();
connectDB();

/**
 * Helper to simulate random delay
 */
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const worker = new Worker(
  'document-processing',
  async (job: Job) => {
    const { jobId, fileUrl } = job.data;
    
    logger.info(`Started processing job: ${jobId}`);

    try {
      // 1. Update status to "processing"
      await JobService.updateJob(jobId, {
        status: 'processing',
        startedAt: new Date(),
      });

      // 2. Simulate delay (10-20 sec)
      const simulationTime = Math.floor(Math.random() * (20000 - 10000 + 1) + 10000);
      await delay(simulationTime);

      // 3. Generate mock result JSON
      const result = {
        processedFileUrl: `https://storage.cdn.com/processed/${jobId}.mp4`,
        duration: `${simulationTime / 1000}s`,
        originalFile: fileUrl,
      };

      // 4. Update status to "completed"
      await JobService.updateJob(jobId, {
        status: 'completed',
        completedAt: new Date(),
        result,
      });

      logger.info(`Job completed: ${jobId}`);
      return result;
    } catch (error: any) {
      logger.error(`Error processing job ${jobId}: ${error.message}`);
      
      // Update status to "failed"
      await JobService.updateJob(jobId, {
        status: 'failed',
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('ready', () => {
  logger.info(`=================================`);
  logger.info(`👷 Worker started (concurrency: 5)`);
  logger.info(`=================================`);
});

worker.on('failed', (job, err) => {
  if (job) {
    logger.error(`Job ${job.id} failed in worker: ${err.message}`);
  }
});

export default worker;
