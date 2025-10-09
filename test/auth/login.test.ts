import request from 'supertest';
import assert from 'assert';
import express from 'express';
import authRoutes from '../../src/route/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Login', () => {
  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' })
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'Email and password are required');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' })
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'Email and password are required');
  });

  it('should return 400 when both email and password are missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'Email and password are required');
  });
});