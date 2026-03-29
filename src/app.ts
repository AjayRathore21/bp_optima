import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoute from './routes/health.route';

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
  }

  private initializeRoutes() {
    this.app.use('/health', healthRoute);
  }

  private initializeErrorHandling() {
    // A basic 404 handler
    this.app.use((req, res, next) => {
      res.status(404).json({ message: 'Resource not found' });
    });

    // A basic global error handler
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      res.status(status).json({ message });
    });
  }
}

export default new App().app;
