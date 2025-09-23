// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { User } from "../modules/user/userModels.js";
// import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

// export const register = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         user: {
//           id: user.getDataValue("id"),
//           name: user.getDataValue("name"),
//           email: user.getDataValue("email"),
//           role: user.getDataValue("role"),
//         }
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


// export const login = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required"
//       });
//     }

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     const match = await bcrypt.compare(password, user.getDataValue("password"));
//     if (!match) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     const userPayload = {
//       id: user.getDataValue("id"),
//       email: user.getDataValue("email"),
//       role: user.getDataValue("role")
//     };
//     const accessToken = generateAccessToken(userPayload);
//     const refreshToken = generateRefreshToken(userPayload);

//     return res.json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user: {
//           id: user.getDataValue("id"),
//           name: user.getDataValue("name"),
//           email: user.getDataValue("email"),
//           role: user.getDataValue("role")
//         },
//         accessToken,
//         refreshToken
//       }
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../modules/user/userModels.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendEmailOTP } from "../config/mail";
import { generateOTP } from "../utils/helper";

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false  // New field for OTP verification
    });

    // Generate OTP and send via email
    const otp = generateOTP();
    user.setDataValue("otp", otp);
    user.setDataValue("otpExpires", Date.now() + 5 * 60 * 1000); // expires in 5 min
    await user.save();

    await sendEmailOTP(email, otp);

    return res.status(201).json({
      success: true,
      message: "User registered. OTP sent to email for verification.",
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Verify OTP
export const verifyOTPController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.getDataValue("otp") !== otp || user.getDataValue("otpExpires") < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.setDataValue("isVerified", true);
    user.setDataValue("otp", null);
    user.setDataValue("otpExpires", null);
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });



    const match = await bcrypt.compare(password, user.getDataValue("password"));
    if (!match) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const userPayload = { id: user.getDataValue("id"), email: user.getDataValue("email"), role: user.getDataValue("role") };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return res.json({
      success: true,
      message: "Login successful",
      data: { user: { id: user.getDataValue("id"), name: user.getDataValue("name"), email, role: user.getDataValue("role") }, accessToken, refreshToken }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
