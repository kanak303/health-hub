import express from 'express';
import testSequelize from '../globalTestConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class TestUser extends require('../../src/modules/user/userModels').User {}
class TestClinic extends require('../../src/modules/clinic/clinicModels').Clinic {}

TestUser.init(TestUser.rawAttributes, { sequelize: testSequelize, modelName: 'User', timestamps: false });
TestClinic.init(TestClinic.rawAttributes, { sequelize: testSequelize, modelName: 'Clinic', paranoid: true });

const testCreateClinic = async (req: any, res: any) => {
  try {
    const { hospitalName, doctorName, slug, address, phone } = req.body;

    const existingClinic = await TestClinic.findOne({ where: { slug } });
    if (existingClinic) {
      return res.status(409).json({
        success: false,
        message: 'Clinic with this slug already exists'
      });
    }

    const clinic = await TestClinic.create({
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

const testAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, 'test-secret') as any;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const testAuthorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    next();
  };
};

export const createClinicTestApp = () => {
  const app = express();
  app.use(express.json());
  
  const router = express.Router();
  router.post('/clinics', testAuth, testAuthorize(['clinic_admin']), testCreateClinic);
  
  app.use('/api/clinic-admin', router);
  return app;
};

let testClinicAdminId: string;

export const setupClinicTestDB = async () => {
  await testSequelize.sync({ force: true });
  
  const testClinicAdmin = await TestUser.create({
    name: 'Test Clinic Admin',
    email: 'clinicadmin@test.com',
    password: 'hashedpassword',
    role: 'clinic_admin',
    isVerified: true
  });
  testClinicAdminId = testClinicAdmin.id;
};

export const generateTestToken = (role: string = 'clinic_admin') => {
  return jwt.sign(
    { id: testClinicAdminId, email: 'clinicadmin@test.com', role },
    'test-secret',
    { expiresIn: '1h' }
  );
};

export const getSampleClinic = () => ({
  hospitalName: 'Test Hospital',
  doctorName: 'Dr. Test',
  slug: 'test-hospital',
  address: '123 Test St',
  phone: '1234567890'
});

export const cleanupClinics = async () => {
  await TestClinic.destroy({ where: {}, force: true });
};

export const cleanupClinicUsers = async () => {
  await TestClinic.destroy({ where: {}, force: true });
  await TestUser.destroy({ where: {}, force: true });
};

export { TestUser, TestClinic };