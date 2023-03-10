import express from 'express';
import { login } from './methods/login';
import { register } from './methods/register';
import authMiddleware from '../middlewares/auth-middleware';
import { auth } from './methods/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/auth', authMiddleware, auth);

export default router;
