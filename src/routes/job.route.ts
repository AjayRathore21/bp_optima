import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { upload } from '../utils/multer';

const router = Router();

// POST /jobs - Add a document processing job (via URL or direct upload)
router.post('/', upload.single('file'), jobController.createJob);

// GET /jobs - List all current and completed jobs
router.get('/', jobController.listJobs);

// GET /jobs/:id - Detailed job status, metrics, and results
router.get('/:id', jobController.getJob);

export default router;
