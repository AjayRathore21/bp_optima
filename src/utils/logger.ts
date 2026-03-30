import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Log directory path
const logDir = path.join(process.cwd(), 'logs');

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }: any) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

/**
 * Configure Winston Logger
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Debug log file
    new winston.transports.File({
      filename: path.join(logDir, 'debug.log'),
      level: 'debug',
    }),
    // Error log file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
  ],
});

export { logger };
