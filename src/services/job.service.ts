import Job, { IJob, CreateJobDto, UpdateJobDto } from '../models/job.model';

class JobService {
  /**
   * Create a new job and store it in MongoDB
   */
  public async createJob(data: CreateJobDto): Promise<IJob> {
    const newJob = new Job({
      fileUrl: data.fileUrl,
      status: 'queued',
      attempts: 0,
    });

    return await newJob.save();
  }

  /**
   * Retrieve a job by its unique ID
   */
  public async getJobById(id: string): Promise<IJob | null> {
    return await Job.findById(id);
  }

  /**
   * Update an existing job's status or details
   */
  public async updateJob(id: string, updateData: UpdateJobDto): Promise<IJob | null> {
    return await Job.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * List all jobs (utility)
   */
  public async getAllJobs(): Promise<IJob[]> {
    return await Job.find().sort({ createdAt: -1 });
  }
}

export default new JobService();
