import request from 'supertest';
import assert from 'assert';
import { createTestApp, getSampleDoctor, setupTestDB, cleanupDoctors, cleanupUsers, TestDoctor } from './testSetup';

const app = createTestApp();

describe('Update Doctor', () => {
  let doctorId: string;
  let sampleDoctor: any;

  before(async () => {
    await setupTestDB();
    sampleDoctor = getSampleDoctor();
  });

  beforeEach(async () => {
    await cleanupDoctors();
    // Create a doctor for testing
    const doctor = await TestDoctor.create(sampleDoctor);
    doctorId = doctor.id;
  });

  after(async () => {
    await cleanupUsers();
  });

  it('should update a doctor', async () => {
    const updateData = { 
      specialty: 'Neurologist',
      consultationFee: 600.00
    };

    const res = await request(app)
      .put(`/api/doctors/${doctorId}`)
      .send(updateData)
      .expect(200);

    assert.strictEqual(res.body.specialty, 'Neurologist');
    assert.strictEqual(parseFloat(res.body.consultationFee), 600.00);
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174999';
    
    await request(app)
      .put(`/api/doctors/${fakeId}`)
      .send({ specialty: 'Neurologist' })
      .expect(404);
  });

  it('should return 400 for invalid update data', async () => {
    await request(app)
      .put(`/api/doctors/${doctorId}`)
      .send({ consultationFee: 'invalid' })
      .expect(400);
  });
});