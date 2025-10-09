import request from 'supertest';
import assert from 'assert';
import { createTestApp, getSampleDoctor, setupTestDB, cleanupDoctors, cleanupUsers, TestDoctor } from './testSetup';

const app = createTestApp();

describe('Delete Doctor', () => {
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

  it('should soft delete a doctor', async () => {
    const res = await request(app)
      .delete(`/api/doctors/${doctorId}`)
      .expect(200);

    assert.strictEqual(res.body.success, true);
    assert(res.body.message.includes('deactivated'));

    // Verify doctor is soft deleted (isActive = false)
    const doctor = await TestDoctor.findByPk(doctorId);
    assert.strictEqual(doctor?.isActive, false);
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174999';
    
    await request(app)
      .delete(`/api/doctors/${fakeId}`)
      .expect(404);
  });

  it('should return 404 when trying to delete already deleted doctor', async () => {
    // First delete
    await request(app)
      .delete(`/api/doctors/${doctorId}`)
      .expect(200);

    // Try to delete again
    await request(app)
      .delete(`/api/doctors/${doctorId}`)
      .expect(404);
  });
});