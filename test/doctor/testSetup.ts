import express from 'express';
import testSequelize from '../globalTestConfig';
import doctorRoutes from '../../src/route/doctorRoutes';
import { DataTypes } from 'sequelize';

// Define test models that use test database only
class TestUser extends require('../../src/modules/user/userModels').User {}
class TestDoctor extends require('../../src/modules/doctors/doctorModel').Doctor {}

// Initialize with test database
TestUser.init(TestUser.rawAttributes, { sequelize: testSequelize, modelName: 'User', timestamps: false });
TestDoctor.init(TestDoctor.rawAttributes, { sequelize: testSequelize, modelName: 'Doctor', timestamps: true });

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/doctors', doctorRoutes);
  return app;
};

let testUserId: string;

export const setupTestDB = async () => {
  await testSequelize.sync({ force: true }); // Safe - only affects test DB
  
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
  availability: { monday: '9-17', tuesday: '9-17' }
});

export const cleanupDoctors = async () => {
  await TestDoctor.destroy({ where: {}, force: true });
};

export const cleanupUsers = async () => {
  await TestUser.destroy({ where: {}, force: true });
};

// Export test models for use in tests
export { TestUser, TestDoctor };