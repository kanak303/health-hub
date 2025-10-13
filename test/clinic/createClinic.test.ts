import request from 'supertest';
import assert from 'assert';
import { 
  createClinicTestApp, 
  setupClinicTestDB, 
  generateTestToken, 
  getSampleClinic, 
  cleanupClinics, 
  cleanupClinicUsers 
} from './clinicTestSetup';

const app = createClinicTestApp();

describe('Create Clinic', () => {
  before(async () => {
    await setupClinicTestDB();
  });

  beforeEach(async () => {
    await cleanupClinics();
  });

  after(async () => {
    await cleanupClinicUsers();
  });

  it('should create a new clinic', async () => {
    const token = generateTestToken();
    const sampleClinic = getSampleClinic();
    
    const res = await request(app)
      .post('/api/clinic-admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleClinic)
      .expect(201);

    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.clinic.hospitalName, sampleClinic.hospitalName);
    assert.strictEqual(res.body.data.clinic.slug, sampleClinic.slug);
  });

  it('should return 409 for duplicate slug', async () => {
    const token = generateTestToken();
    const sampleClinic = getSampleClinic();
    
    // Create first clinic
    await request(app)
      .post('/api/clinic-admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleClinic)
      .expect(201);

    // Try to create with same slug
    await request(app)
      .post('/api/clinic-admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleClinic)
      .expect(409);
  });

  it('should return 401 without token', async () => {
    const sampleClinic = getSampleClinic();
    
    await request(app)
      .post('/api/clinic-admin/clinics')
      .send(sampleClinic)
      .expect(401);
  });

  it('should return 403 for non-clinic-admin role', async () => {
    const token = generateTestToken('patient');
    const sampleClinic = getSampleClinic();
    
    await request(app)
      .post('/api/clinic-admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleClinic)
      .expect(403);
  });
});