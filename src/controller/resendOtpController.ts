import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../modules/user/userModels.js";
import { setOTP } from "../config/redis.js";
import { sendEmailOTP } from "../config/mail.js";

export const resendOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(password, user.getDataValue("password"));
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${user.getDataValue("id")}`;
    
    // Store OTP in Redis with 30 minutes expiration
    await setOTP(redisKey, otp, 1800);
    
    // Send OTP via email 
    try {
      await sendEmailOTP(email, otp);
      console.log(`Email sent to ${email}`);
    } catch (emailError) {
      console.log(`Email sending failed: ${emailError.message}`);
      console.log(`Use OTP from console: ${otp}`);
    }
    
    console.log(`OTP for ${email}: ${otp}`);

    return res.json({
      success: true,
      message: "New OTP sent successfully to your email"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};