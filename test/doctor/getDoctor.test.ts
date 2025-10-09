import request from 'supertest';
import assert from 'assert';
import { createTestApp, getSampleDoctor, setupTestDB, cleanupDoctors, cleanupUsers, TestDoctor } from './testSetup';

const app = createTestApp();

describe('Get Doctor', () => {
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

  it('should get all doctors', async () => {
    const res = await request(app)
      .get('/api/doctors')
      .expect(200);

    assert(Array.isArray(res.body), 'Response should be an array');
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].name, sampleDoctor.name);
  });

  it('should get a doctor by ID', async () => {
    const res = await request(app)
      .get(`/api/doctors/${doctorId}`)
      .expect(200);

    assert.strictEqual(res.body.name, sampleDoctor.name);
    assert.strictEqual(res.body.specialty, sampleDoctor.specialty);
  });

  it('should return 404 for non-existent doctor', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174999';
    
    await request(app)
      .get(`/api/doctors/${fakeId}`)
      .expect(404);
  });
});