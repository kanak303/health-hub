import { Request, Response } from "express";
import { User } from "../modules/user/userModels";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token";

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required"
      });
    }

    // Verify refresh token 

    const decoded = verifyRefreshToken(refreshToken) as any;
    
    // Find user
    
    const user = await User.findOne({ 
      where: { 
        id: decoded.id
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Generate new tokens
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