import request from 'supertest';
import assert from 'assert';
import express from 'express';
import authRoutes from '../../src/route/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth OTP', () => {
  describe('POST /api/auth/verify-otp', () => {
    it('should return 401 when no authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ otp: '123456' })
        .expect(401);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Access token required');
    });

    it('should return 400 when OTP is missing', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .set('Authorization', 'Bearer invalid-token')
        .send({});

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'OTP is required');
    });
  });

  describe('POST /api/auth/resend-otp', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/resend-otp')
        .send({ password: 'password123' })
        .expect(400);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Email and password are required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/resend-otp')
        .send({ email: 'test@example.com' })
        .expect(400);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Email and password are required');
    });
  });
});