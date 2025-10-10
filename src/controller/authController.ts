import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../modules/user/userModels";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/token";
import { setOTP, getOTP, deleteOTP } from "../config/redis";
import { sendEmailOTP } from "../config/mail";

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
        role:'patient'
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.getDataValue("id"),
          name: user.getDataValue("name"),
          email: user.getDataValue("email"),
          role: user.getDataValue("role"),
        }
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Single login API with OTP verification
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, otp } = req.body;

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

    const storedPassword = user.getDataValue("password");
    console.log(`Login attempt for: ${email}`);
    console.log(`Stored password hash: ${storedPassword}`);
    console.log(`Provided password: ${password}`);
    
    const match = await bcrypt.compare(password, storedPassword);
    console.log(`Password match result: ${match}`);
    
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // If no OTP provided, generate and send OTP
    if (!otp) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const redisKey = `otp:${user.getDataValue("id")}`;
      
      // Store OTP in Redis with 30 minutes expiration
      await setOTP(redisKey, newOtp, 1800);
      
      // Send OTP via email
      try {
        await sendEmailOTP(email, newOtp);
        console.log(`Email sent to ${email}`);
      } catch (emailError) {
        console.log(`Email sending failed: ${(emailError as Error).message}`);
        console.log(`Use OTP from console: ${newOtp}`);
      }
      
      console.log(`OTP for ${email}: ${newOtp}`);

      return res.json({
        success: true,
        message: "OTP sent to your email. Please verify to complete login.",
        requiresOTP: true
      });
    }

    // If OTP provided then verify it from Redis
    const redisKey = `otp:${user.getDataValue("id")}`;
    const storedOTP = await getOTP(redisKey);
    const providedOTP = String(otp).trim();
    
    console.log(`User ID: ${user.getDataValue("id")}`);
    console.log(`Redis Key: ${redisKey}`);
    console.log(`Stored OTP: '${storedOTP}' (type: ${typeof storedOTP}, length: ${storedOTP?.length || 0})`);
    console.log(`Provided OTP: '${providedOTP}' (type: ${typeof providedOTP}, length: ${providedOTP.length})`);
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
        message: "Invalid OTP",
        debug: {
          stored: storedOTP,
          provided: providedOTP,
          storedLength: storedOTP?.length,
          providedLength: providedOTP.length
        }
      });
    }

    // Clear OTP from Redis after successful verification
    await deleteOTP(redisKey);

    const userPayload = {
      id: user.getDataValue("id"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role")
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Forgot Password 
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate OTP for reset
    const otp = crypto.randomInt(100000, 999999).toString();
    // user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // Send OTP email
    await sendEmailOTP(email, otp);

    return res.status(200).json({ success: true, message: "OTP sent to email for password reset" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

//Reset Password 
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: "Email, OTP, and new password are required" 
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Debug logging
    console.log(`Stored resetToken: '${user.resetToken}'`);
    console.log(`Provided OTP: '${otp}'`);
    console.log(`OTP type: ${typeof otp}`);
    console.log(`resetToken type: ${typeof user.resetToken}`);
    console.log(`Comparison result: ${user.resetToken === String(otp).trim()}`);

    // Validate OTP
    if (!user.resetToken || user.resetToken !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log(`New password hash: ${hashedPassword}`);
    
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetToken = null;
    user.resetTokenExpiry = null;
    
    await user.save();
    console.log(`Password updated for user: ${email}`);

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


// Send OTP (requires authentication)
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${decoded.id}`;
    
    await setOTP(redisKey, otp, 1800);
    
    try {
      await sendEmailOTP(user.getDataValue("email"), otp);
    } catch (emailError) {
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

// Verify OTP (requires authentication)
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
    
    if (!storedOTP || storedOTP !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: storedOTP ? "Invalid OTP" : "OTP expired or not found"
      });
    }

    await deleteOTP(redisKey);

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

// Resend OTP
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${user.getDataValue("id")}`;
    
    await setOTP(redisKey, otp, 1800);
    
    try {
      await sendEmailOTP(email, otp);
    } catch (emailError) {
      console.log(`Email sending failed: ${(emailError as Error).message}`);
      console.log(`Use OTP from console: ${otp}`);
    }

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

// Refresh Token
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required"
      });
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    const userPayload = {
      id: user.getDataValue("id"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role")
    };
    
    const newAccessToken = generateAccessToken(userPayload);
    const newRefreshToken = generateRefreshToken(userPayload);

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.json({
      success: true,
      message: "User logged out successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};