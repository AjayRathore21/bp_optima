import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoute from './routes/health.route';
import jobRoute from './routes/job.route';

import { globalErrorHandler } from './middlewares/error.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static('uploads'));
  }

  private initializeRoutes() {
    this.app.use('/health', healthRoute);
    this.app.use('/jobs', jobRoute);
  }

  private initializeErrorHandling() {
    // 404 handler
    this.app.use((req, res, next) => {
      res.status(404).json({ message: 'Resource not found' });
    });

    // Global error listener
    this.app.use(globalErrorHandler);
  }
}

export default new App().app;
