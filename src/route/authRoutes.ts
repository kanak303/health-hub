import express from 'express';
import { register, login, forgotPassword, resetPassword, logout } from '../controller/authController.js';
import { refreshToken } from '../controller/refreshController.js';
import { resendOTP } from '../controller/resendOtpController.js';
import { sendOTP, verifyOTP } from '../controller/otpController.js';

const router = express.Router();
// login signup
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/refresh', refreshToken);

// Send OTP to reset password
router.post('/forgot-password', forgotPassword); 

// password reset
router.post('/reset-password', resetPassword);

// logout user
router.post('/logout', logout);

export default router;