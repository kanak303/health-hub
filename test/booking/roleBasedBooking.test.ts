import request from 'supertest';
import assert from 'assert';
import express from 'express';
import { authenticate, authorize } from '../../src/middleware/auth';
import { generateAccessToken } from '../../src/utils/token';

// Mock booking 
const mockCreateBooking = (req: any, res: any) => {
  res.status(201).json({ 
    message: 'Booking created successfully',
    userId: req.user.id,
    userRole: req.user.role
  });
};

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  //  middleware
  app.post('/api/bookings', authenticate, authorize(['patient']), mockCreateBooking);
  
  return app;
};

const app = createTestApp();

describe('Role-based Booking Access Control', () => {
  const testUsers = {
    patient: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      email: 'patient@test.com',
      role: 'patient'
    },
    doctor: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      email: 'doctor@test.com',
      role: 'doctor'
    },
    admin: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      email: 'admin@test.com',
      role: 'admin'
    },
    clinicAdmin: {
      id: '123e4567-e89b-12d3-a456-426614174004',
      email: 'clinic.admin@test.com',
      role: 'clinic_admin'
    }
  };

  it('should allow patient to create booking', async () => {
    const token = generateAccessToken(testUsers.patient);
    
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.userRole, 'patient');
  });

  it('should return 403 for doctor trying to create booking', async () => {
    const token = generateAccessToken(testUsers.doctor);
    
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert(res.body.message.includes('Only patient role(s) can perform this action'));
    assert.strictEqual(res.body.userRole, 'doctor');
  });

  it('should return 403 for admin trying to create booking', async () => {
    const token = generateAccessToken(testUsers.admin);
    
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert(res.body.message.includes('Only patient role(s) can perform this action'));
    assert.strictEqual(res.body.userRole, 'admin');
  });

  it('should return 403 for clinic admin trying to create booking', async () => {
    const token = generateAccessToken(testUsers.clinicAdmin);
    
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert(res.body.message.includes('Only patient role(s) can perform this action'));
    assert.strictEqual(res.body.userRole, 'clinic_admin');
  });

  it('should return 401 for request without token', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Access token required');
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        slotId: 'test-slot-id',
        amount: 150.00,
        paymentMethod: 'credit_card'
      });
    
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Invalid or expired token');
  });
});