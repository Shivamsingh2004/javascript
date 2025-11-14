import { Router } from 'express';
import {
  submitCode,
  getUserSubmissions,
  getSubmissionById,
} from '../controllers/submissionController';
import { authenticate } from '../middleware/auth';
import { validate, submitCodeSchema } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, validate(submitCodeSchema), submitCode);
router.get('/', authenticate, getUserSubmissions);
router.get('/:id', authenticate, getSubmissionById);

export default router;
