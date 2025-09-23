import { Request, Response } from "express";
import { User } from "../modules/user/userModels.js";
import { verifyAccessToken } from "../utils/token.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP requires authentication
export const sendOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    const decoded = verifyAccessToken(token) as any;
    const user = await User.findOne({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.update({ otp, otpExpires });

    console.log(`OTP for user ${decoded.id}: ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      otp: otp
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Verify OTP requires authentication
export const verifyOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { otp } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required"
      });
    }

    const decoded = verifyAccessToken(token) as any;
    const user = await User.findOne({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.getDataValue("otp") !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    await user.update({ 
      isVerified: true, 
      otp: null, 
      otpExpires: null 
    });

    return res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};