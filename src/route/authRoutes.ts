import express from 'express';
import { 
  register, 
  login, 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  logout 
} from '../controller/authController';

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