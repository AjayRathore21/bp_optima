import { Router } from 'express';
import JobController from '../controllers/job.controller';

const router = Router();
const jobController = new JobController();

// POST /jobs
router.post('/', jobController.createJob);

// GET /jobs/:id
router.get('/:id', jobController.getJob);

export default router;
