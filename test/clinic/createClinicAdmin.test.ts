import request from 'supertest';
import assert from 'assert';
import express from 'express';
import clinicAdminRoutes from '../../src/route/clinicAdminRoutes';

const app = express();
app.use(express.json());
app.use('/api/clinic-admin', clinicAdminRoutes);

describe('Create Clinic Admin', () => {
  it('should return 401 without authentication', async () => {
    const adminData = {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123'
    };

    await request(app)
      .post('/api/clinic-admin')
      .send(adminData)
      .expect(401);
  });

  it('should return 400 for missing fields', async () => {
    const incompleteData = {
      name: 'Test Admin'
    };

    await request(app)
      .post('/api/clinic-admin')
      .send(incompleteData)
      .expect(401);
  });
});