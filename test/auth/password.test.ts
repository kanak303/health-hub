import request from 'supertest';
import assert from 'assert';
import express from 'express';
import authRoutes from '../../src/route/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Password', () => {
  describe('POST /api/auth/reset-password', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ otp: '123456', newPassword: 'newpassword123' })
        .expect(400);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Email, OTP, and new password are required');
    });

    it('should return 400 when OTP is missing', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'test@example.com', newPassword: 'newpassword123' })
        .expect(400);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Email, OTP, and new password are required');
    });

    it('should return 400 when newPassword is missing', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'test@example.com', otp: '123456' })
        .expect(400);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Email, OTP, and new password are required');
    });
  });
});