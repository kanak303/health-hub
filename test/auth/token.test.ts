import request from 'supertest';
import assert from 'assert';
import express from 'express';
import authRoutes from '../../src/route/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Token', () => {
  describe('POST /api/auth/refresh', () => {
    it('should return 401 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(401);

      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Refresh token required');
    });
  });
});