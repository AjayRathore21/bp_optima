import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  
  // Log the detailed error stack in development/internal logs
  logger.error(`[${req.method}] ${req.url} - ${statusCode}: ${message}`);
  if (statusCode === 500 && err.stack) {
    logger.error(`Stack trace: ${err.stack}`);
  }

  // Consistent API error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
