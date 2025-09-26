import { Request, Response } from "express";
import { Doctor } from "../modules/doctors/doctorModel";
import { User } from "../modules/user/userModels";

export const createDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      userId,
      name,
      specialty,
      experience,
      qualification,
      licenseNumber,
      phone,
      consultationFee,
      availability,
      bio,
      profileImage
    } = req.body;

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

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor profile already exists for this user"
      });
    }

    const doctor = await Doctor.create({
      userId,
      name,
      specialty,
      experience,
      qualification,
      licenseNumber,
      phone,
      consultationFee,
      availability,
      bio,
      profileImage
    });

    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: { doctor }
    });
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

    return res.json({
      success: true,
      data: { doctors }
    });
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

    return res.json({
      success: true,
      data: { doctor }
    });
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

    return res.json({
      success: true,
      message: "Doctor profile updated successfully",
      data: { doctor }
    });
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
    if (!doctor) {
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