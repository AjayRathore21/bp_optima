import Job, { IJob, CreateJobDto, UpdateJobDto } from '../models/job.model';
import { addJobToQueue } from '../queue/queue';

class JobService {
  /**
   * Create a new job and store it in MongoDB, then add it to BullMQ
   */
  public async createJob(data: CreateJobDto): Promise<IJob> {
    const newJob = new Job({
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      originalName: data.originalName,
      fileType: data.fileType,
      status: 'queued',
      attempts: 0,
    });

    const savedJob = await newJob.save();

    // Add to BullMQ
    // Add explicitly to handle potential undefined
    await addJobToQueue(savedJob._id.toString(), savedJob.fileUrl || savedJob.fileName);

    return savedJob;
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
