import request from 'supertest';
import assert from 'assert';
import { createTestApp, getSampleDoctor, setupTestDB, cleanupDoctors, cleanupUsers } from './testSetup';

const app = createTestApp();

describe('Create Doctor', () => {
  before(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await cleanupDoctors();
  });

  after(async () => {
    await cleanupUsers();
  });

  it('should create a new doctor', async () => {
    const sampleDoctor = getSampleDoctor();
    const res = await request(app)
      .post('/api/doctors')
      .send(sampleDoctor);
    
    if (res.status !== 201) {
      console.log('Error response:', res.body);
    }
    
    assert.strictEqual(res.status, 201);
    assert(res.body.id, 'Response should have id property');
    assert.strictEqual(res.body.name, sampleDoctor.name);
    assert.strictEqual(res.body.specialty, sampleDoctor.specialty);
  });

  it('should return 400 for invalid doctor data', async () => {
    const invalidDoctor = { name: 'Dr. Test' }; 
    
    await request(app)
      .post('/api/doctors')
      .send(invalidDoctor)
      .expect(400);
  });
});
