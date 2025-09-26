import { Request, Response } from "express";
import { User } from "../modules/user/userModels";
import { verifyAccessToken } from "../utils/token";
import { setOTP, getOTP, deleteOTP } from "../config/redis";
import { sendEmailOTP } from "../config/mail";

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
    const redisKey = `otp:${decoded.id}`;
    
    console.log(`Generated OTP for ${user.getDataValue("email")}: ${otp}`);
    
    // Store OTP in Redis with 30 minutes expiration
    await setOTP(redisKey, otp, 1800);
    
    // Send OTP via email 
    try {
      await sendEmailOTP(user.getDataValue("email"), otp);
      console.log(`Email sent to ${user.getDataValue("email")}`);
    } catch (emailError ) {
      console.log(`Email sending failed: ${(emailError as Error).message}`);
      console.log(`Use OTP from console: ${otp}`);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully to your email"
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

    const redisKey = `otp:${decoded.id}`;
    const storedOTP = await getOTP(redisKey);
    const providedOTP = String(otp).trim();
    
    console.log(`User ID: ${decoded.id}`);
    console.log(`Redis Key: ${redisKey}`);
    console.log(`Stored OTP: '${storedOTP}' (length: ${storedOTP?.length || 0})`);
    console.log(`Provided OTP: '${providedOTP}' (length: ${providedOTP.length})`);
    console.log(`Stored is null: ${storedOTP === null}`);
    console.log(`Exact match: ${storedOTP === providedOTP}`);
    
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found"
      });
    }
    
    if (storedOTP !== providedOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Delete OTP from Redis and update user verification status
    await deleteOTP(redisKey);
    await user.update({ isVerified: true });

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