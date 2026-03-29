import { Router } from 'express';
import JobController from '../controllers/job.controller';
import { upload } from '../utils/multer';

const router = Router();
const jobController = new JobController();

// POST /jobs (Accepts both file upload and JSON url)
router.post('/', upload.single('file'), jobController.createJob);

// GET /jobs (List all jobs)
router.get('/', jobController.listJobs);

// GET /jobs/:id (Get job by ID)
router.get('/:id', jobController.getJob);

export default router;
