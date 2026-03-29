import { Request, Response, NextFunction } from 'express';
import HealthService from '../services/health.service';
import { logger } from '../utils/logger';

class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public checkHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = await this.healthService.getSystemHealth();
      logger.info('Health check called');
      res.status(200).json({
        message: 'System is healthy',
        data: status,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default HealthController;
