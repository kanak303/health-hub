import express from 'express';
import testSequelize from '../globalTestConfig';
import { DataTypes } from 'sequelize';
import { validate } from '../../src/middleware/validate';
import { createDoctorSchema, updateDoctorSchema } from '../../src/modules/doctors/doctorValidation';
import bcrypt from 'bcrypt';

// Define test models that use test database only
class TestUser extends require('../../src/modules/user/userModels').User {}
class TestDoctor extends require('../../src/modules/doctors/doctorModel').Doctor {}
class TestClinic extends require('../../src/modules/clinic/clinicModels').Clinic {}

// Initialize with test database
TestUser.init(TestUser.rawAttributes, { sequelize: testSequelize, modelName: 'User', timestamps: false });
TestClinic.init(TestClinic.rawAttributes, { sequelize: testSequelize, modelName: 'Clinic', paranoid: true });
TestDoctor.init(TestDoctor.rawAttributes, { sequelize: testSequelize, modelName: 'Doctor', timestamps: true });

// Create test-specific controllers that directly use test models
const testCreateDoctor = async (req: any, res: any) => {
  try {
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

    let doctorUserId = userId;

    if (!userId && email && password) {
      const existingUser = await TestUser.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await TestUser.create({
        name,
        email,
        password: hashedPassword,
        role: 'doctor',
        isVerified: true
      });
      doctorUserId = newUser.id;
    } else if (userId) {
      const user = await TestUser.findByPk(userId);
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

    const existingDoctor = await TestDoctor.findOne({ where: { userId: doctorUserId } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor profile already exists for this user"
      });
    }

    const doctor = await TestDoctor.create({
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const testGetDoctors = async (req: any, res: any) => {
  try {
    const { specialty, isActive = true } = req.query;
    
    const whereClause: any = { isActive };
    if (specialty) {
      whereClause.specialty = specialty;
    }

    const doctors = await TestDoctor.findAll({
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

const testGetDoctorById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const doctor = await TestDoctor.findByPk(id);
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

const testUpdateDoctor = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await TestDoctor.findByPk(id);
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

const testDeleteDoctor = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const doctor = await TestDoctor.findByPk(id);
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

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Create test routes that use test controllers
  const router = express.Router();
  router.post('/', validate(createDoctorSchema), testCreateDoctor);
  router.get('/', testGetDoctors);
  router.get('/:id', testGetDoctorById);
  router.put('/:id', validate(updateDoctorSchema), testUpdateDoctor);
  router.delete('/:id', testDeleteDoctor);
  
  app.use('/api/doctors', router);
  return app;
};

let testUserId: string;

let testClinicId: string;

export const setupTestDB = async () => {
  await testSequelize.sync({ force: true }); // Safe - only affects test DB
  
  // Create test clinic
  const testClinic = await TestClinic.create({
    hospitalName: 'Test Hospital',
    doctorName: 'Test Doctor',
    slug: 'test-hospital',
    address: 'Test Address',
    phone: '1234567890'
  });
  testClinicId = testClinic.id;
  
  // Create test user
  const testUser = await TestUser.create({
    name: 'Test Doctor User',
    email: 'testdoctor@example.com',
    password: 'hashedpassword',
    role: 'doctor',
    isVerified: true
  });
  testUserId = testUser.id;
};

export const getSampleDoctor = () => ({
  userId: testUserId,
  name: 'Dr. John Doe',
  specialty: 'Cardiologist',
  experience: 5,
  qualification: 'MBBS, MD',
  licenseNumber: 'LIC123456',
  phone: '1234567890',
  consultationFee: 500.00,
  availability: { monday: '9-17', tuesday: '9-17' },
  clinicId: testClinicId
});

export const cleanupDoctors = async () => {
  await TestDoctor.destroy({ where: {}, force: true });
};

export const cleanupUsers = async () => {
  // First delete all doctors to avoid foreign key constraint
  await TestDoctor.destroy({ where: {}, force: true });
  // Then delete users
  await TestUser.destroy({ where: {}, force: true });
};

// Export test models for use in tests
export { TestUser, TestDoctor, TestClinic };