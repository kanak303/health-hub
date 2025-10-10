import { Request, Response } from "express";
import { Doctor } from "../modules/doctors/doctorModel";
import { User } from "../modules/user/userModels";
import { Clinic } from "../modules/clinic/clinicModels";
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createDoctor = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // Permission check
    if (req.user?.role !== 'clinic_admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: "Not allowed" });
    }

    const {
      userId,
      email,
      password,
      name,
      specialty,
      experience,
      qualification,
      licenseNumber,
      phone,
      consultationFee,
      availability,
      bio,
      profileImage,
      clinicId
    } = req.body;

    // Check if clinicId is provided
    if (!clinicId) {
      return res.status(422).json({
        error: "Clinic ID is required to create a doctor"
      });
    }

    // Check if clinic exists
    const clinic = await Clinic.findByPk(clinicId);
    if (!clinic) {
      return res.status(404).json({
        error: "Clinic not found"
      });
    }

    let doctorUserId = userId;

    // If userId is not provided, create new account
    if (!userId && email && password) {
      // Check if user with email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      // Create new user account
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'doctor',
        isVerified: true
      });
      doctorUserId = newUser.id;
    } else if (userId) {
      // Check if user exists and has doctor role
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (user.getDataValue("role") !== "doctor") {
        return res.status(400).json({
          success: false,
          message: "User must have doctor role"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either userId or email and password must be provided"
      });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ where: { userId: doctorUserId } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor profile already exists for this user"
      });
    }

    const doctor = await Doctor.create({
      userId: doctorUserId,
      name,
      specialty,
      experience,
      qualification,
      licenseNumber,
      phone,
      consultationFee,
      availability,
      bio,
      profileImage,
      clinic_id: clinicId
    });

    return res.status(201).json(doctor);
  } catch (error: any) {
    console.error('Create doctor error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: error.stack
    });
  }
};

export const getDoctors = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { specialty, isActive = true } = req.query;
    
    const whereClause: any = { isActive };
    if (specialty) {
      whereClause.specialty = specialty;
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']]
    });

    return res.json(doctors);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getDoctorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.json(doctor);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const updateDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    await doctor.update(updateData);

    return res.json(doctor);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    await doctor.update({ isActive: false });

    return res.json({
      success: true,
      message: "Doctor profile deactivated successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};