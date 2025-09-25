import express from 'express';
import { register, login } from '../controller/authController.js';
import { refreshToken } from '../controller/refreshController.js';
import { resendOTP } from '../controller/resendOtpController.js';
import { sendOTP, verifyOTP } from '../controller/otpController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/refresh', refreshToken);

export default router;