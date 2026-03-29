import { Request, Response, NextFunction } from 'express';
import JobService from '../services/job.service';

class JobController {
  /**
   * Create a new job
   */
  public createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let jobData: any = {};

      if (req.file) {
        // Handled file upload
        jobData = {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          fileType: req.file.mimetype,
          fileUrl: `/uploads/${req.file.filename}`, // local relative URL
        };
      } else {
        // Fallback to URL in body
        const { fileUrl } = req.body;
        if (!fileUrl) {
          res.status(400).json({ message: 'fileUrl or file upload is required' });
          return;
        }
        jobData = { fileUrl };
      }

      const job = await JobService.createJob(jobData);

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

      res.status(200).json({
        jobId: job._id,
        status: job.status,
        result: job.result,
        timestamps: {
          createdAt: job.createdAt,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * List all jobs
   */
  public listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobs = await JobService.getAllJobs();
      res.status(200).json(jobs.map(job => ({
        jobId: job._id,
        status: job.status,
        originalName: job.originalName,
        fileUrl: job.fileUrl,
        createdAt: job.createdAt
      })));
    } catch (error) {
      next(error);
    }
  };
}

export default JobController;
