import { Router } from 'express';
import { signup, login, refreshToken, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, signupSchema, loginSchema } from '../middleware/validation';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);

export default router;
