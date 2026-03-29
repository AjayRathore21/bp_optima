import { Request, Response, NextFunction } from 'express';
import JobService from '../services/job.service';

class JobController {
  /**
   * Create a new job
   */
  public createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { fileUrl } = req.body;

      if (!fileUrl) {
        res.status(400).json({ message: 'fileUrl is required' });
        return;
      }

      // We expect CreateJobDto = { fileUrl: string }
      const job = await JobService.createJob({ fileUrl });

      res.status(201).json({
        jobId: job._id,
        status: job.status,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get job status by ID
   */
  public getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);

      if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }

      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  };
}

export default JobController;
