import request from 'supertest';
import assert from 'assert';
import express from 'express';
import authRoutes from '../../src/route/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Register', () => {
  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', role: 'patient' })
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'All fields are required');
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'kanak', password: 'password123', role: 'patient' })
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'All fields are required');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'kanak', email: 'test@example.com', role: 'patient' })
      .expect(400);

    assert.strictEqual(response.body.success, false);
    assert.strictEqual(response.body.message, 'All fields are required');
  });

  it('should create user with patient role when no role provided', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'kanak', email: uniqueEmail, password: 'password123' })
      .expect(201);

    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.user.role, 'patient');
  });
});