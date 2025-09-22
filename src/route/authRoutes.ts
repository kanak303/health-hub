import express from 'express';
import { register, login } from '../controller/authController.js';
import { refreshToken } from '../controller/refreshController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;