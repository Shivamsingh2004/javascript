import { Router } from 'express';
import { runCode } from '../controllers/runController';
import { authenticate } from '../middleware/auth';
import { validate, runCodeSchema } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, validate(runCodeSchema), runCode);

export default router;
