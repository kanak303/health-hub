import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../modules/user/userModels.js";

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
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000);
    
    await user.update({ otp, otpExpires });
    
    console.log(`New OTP for ${email}: ${otp}`);

    return res.json({
      success: true,
      message: "New OTP sent successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};