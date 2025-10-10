import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../modules/user/userModels';
import { Doctor } from '../modules/doctors/doctorModel';
import { Clinic } from '../modules/clinic/clinicModels';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createClinicAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create clinic admin user
    const clinicAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'clinic_admin',
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Clinic admin created successfully',
      data: {
        id: clinicAdmin.id,
        name: clinicAdmin.name,
        email: clinicAdmin.email,
        role: clinicAdmin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createDoctorForClinic = async (req: AuthRequest, res: Response) => {
  try {
    const {
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
      clinic_id
    } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user account with doctor role
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      isVerified: true
    });

    // Create doctor profile with clinic_id
    const doctor = await Doctor.create({
      userId: newUser.id,
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
      clinic_id
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createClinic = async (req: AuthRequest, res: Response) => {
  try {
    const { hospitalName, doctorName, slug, address, phone } = req.body;

    const existingClinic = await Clinic.findOne({ where: { slug } });
    if (existingClinic) {
      return res.status(409).json({
        success: false,
        message: 'Clinic with this slug already exists'
      });
    }

    const clinic = await Clinic.create({
      hospitalName,
      doctorName,
      slug,
      address,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Clinic created successfully',
      data: { clinic }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};