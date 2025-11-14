import { Router } from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, createProblemSchema, updateProblemSchema } from '../middleware/validation';

const router = Router();

// Public/user routes
router.get('/', authenticate, getProblems);
router.get('/:id', authenticate, getProblemById);

// Admin routes
router.post('/', authenticate, authorize('admin'), validate(createProblemSchema), createProblem);
router.put('/:id', authenticate, authorize('admin'), validate(updateProblemSchema), updateProblem);
router.delete('/:id', authenticate, authorize('admin'), deleteProblem);

export default router;
