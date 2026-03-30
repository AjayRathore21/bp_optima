import { Request, Response, NextFunction } from 'express';
import JobService from '../services/job.service';
import { ICreateJobDTO } from '../interfaces/job.interface';

/**
 * Controller Layer: HTTP interface for job-related operations
 */
class JobController {
  /**
   * Initialize a new document processing job
   */
  public createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobDTO: ICreateJobDTO = this.extractJobData(req);

      if (!jobDTO.fileUrl && !jobDTO.fileName) {
        res.status(400).json({ message: 'Input file URL or document upload is required' });
        return;
      }

      const job = await JobService.createJob(jobDTO);

      res.status(201).json({
        jobId: job._id,
        status: job.status,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Monitor the status and results of a specific job
   */
  public getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await JobService.getJob(id);

      if (!job) {
        res.status(404).json({ message: 'Job not found in database' });
        return;
      }

      res.status(200).json({
        jobId: job._id,
        status: job.status,
        result: job.result,
        metadata: {
          originalName: job.originalName,
          fileType: job.fileType,
        },
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
   * List all current and past jobs in the system
   */
  public listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobs = await JobService.listAllJobs();
      res.status(200).json(jobs.map(job => ({
        jobId: job._id,
        status: job.status,
        originalName: job.originalName,
        createdAt: job.createdAt,
      })));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Internal helper to standardize DTO extraction across request formats
   */
  private extractJobData(req: Request): ICreateJobDTO {
    if (req.file) {
      // Priority: Multer upload data
      return {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileUrl: `/uploads/${req.file.filename}`,
        webhookUrl: req.body.webhookUrl,
      };
    }

    // Fallback: Body parsing for standard JSON
    const { fileUrl, webhookUrl } = req.body;
    return { fileUrl, webhookUrl };
  }
}

export default new JobController();
export { JobController };
