import { IJob, ICreateJobDTO, IUpdateJobDTO } from '../interfaces/job.interface';
import JobRepository from '../repositories/job.repository';
import { addJobToQueue } from '../queue/queue';
import { logger } from '../utils/logger';

/**
 * Service Layer: Orchestrates business logic across repositories and queues
 */
class JobService {
  /**
   * High-level job creation including database save and queuing
   */
  public async createJob(data: ICreateJobDTO): Promise<IJob> {
    try {
      // 1. Persist initial record (status and attempts use schema defaults)
      const job = await JobRepository.create(data);

      // 2. Add to asynchronous processing queue
      const queueInput = job.fileUrl || job.fileName;
      await addJobToQueue(job._id.toString(), queueInput);

      logger.info(`System-wide Job Created: ${job._id}`);
      return job;
    } catch (error: any) {
      logger.error(`Logic Failure in createJob: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find an existing job's technical and process details
   */
  public async getJob(id: string): Promise<IJob | null> {
    return await JobRepository.findById(id);
  }

  /**
   * Update the status or processing results of a job
   */
  public async updateJobInfo(id: string, updateData: IUpdateJobDTO): Promise<IJob | null> {
    return await JobRepository.update(id, updateData);
  }

  /**
   * Retrieve a collection of all system jobs
   */
  public async listAllJobs(): Promise<IJob[]> {
    return await JobRepository.findAll();
  }
}

export default new JobService();
