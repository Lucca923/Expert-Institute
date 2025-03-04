import express from 'express';
import { authController } from '../Controllers/authController';

const router = express.Router();

router.get('/login', authController.login);
router.post('/signup', authController.signup);

export default router;