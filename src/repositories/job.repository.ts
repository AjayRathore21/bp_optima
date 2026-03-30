import { IJob, ICreateJobDTO, IUpdateJobDTO } from '../interfaces/job.interface';
import Job from '../models/job.model';

/**
 * Repository layer for direct MongoDB interactions
 */
class JobRepository {
  /**
   * Save a new job document
   */
  public async create(data: ICreateJobDTO): Promise<IJob> {
    const job = new Job(data);
    return await job.save();
  }

  /**
   * Find a job by its unique identifier
   */
  public async findById(id: string): Promise<IJob | null> {
    return await Job.findById(id);
  }

  /**
   * Update job fields in the database
   */
  public async update(id: string, updateData: IUpdateJobDTO): Promise<IJob | null> {
    return await Job.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true,
    });
  }

  /**
   * Retrieve all jobs, sorted by creation date (descending)
   */
  public async findAll(): Promise<IJob[]> {
    return await Job.find().sort({ createdAt: -1 });
  }

  /**
   * Update multiple attributes for a job (internal use)
   */
  public async save(job: IJob): Promise<IJob> {
    return await job.save();
  }
}

export default new JobRepository();
