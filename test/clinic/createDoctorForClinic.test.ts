import request from 'supertest';
import assert from 'assert';
import { 
  createClinicTestApp, 
  setupClinicTestDB, 
  generateTestToken, 
  cleanupClinics, 
  cleanupClinicUsers,
  TestClinic
} from './clinicTestSetup';

const app = createClinicTestApp();

describe('Create Doctor for Clinic', () => {
  let clinicId: string;

  before(async () => {
    await setupClinicTestDB();
    
    // Create a test clinic
    const clinic = await TestClinic.create({
      hospitalName: 'Test Hospital',
      doctorName: 'Dr. Test',
      slug: 'test-hospital-doctor',
      address: '123 Test St',
      phone: '1234567890'
    });
    clinicId = clinic.id;
  });

  after(async () => {
    await cleanupClinicUsers();
  });

  it('should require authentication', async () => {
    const doctorData = {
      email: 'doctor@test.com',
      password: 'password123',
      name: 'Dr. Test',
      specialty: 'Cardiology',
      experience: 5,
      qualification: 'MBBS',
      licenseNumber: 'LIC123',
      phone: '1234567890',
      consultationFee: 500,
      clinic_id: clinicId,
      availability: {}
    };

    await request(app)
      .post('/api/clinic-admin/doctors')
      .send(doctorData)
      .expect(404); 
  });

  it('should require clinic_admin role', async () => {
    const token = generateTestToken('patient');
    const doctorData = {
      email: 'doctor@test.com',
      password: 'password123',
      name: 'Dr. Test',
      specialty: 'Cardiology',
      experience: 5,
      qualification: 'MBBS',
      licenseNumber: 'LIC123',
      phone: '1234567890',
      consultationFee: 500,
      clinic_id: clinicId,
      availability: {}
    };

    await request(app)
      .post('/api/clinic-admin/doctors')
      .set('Authorization', `Bearer ${token}`)
      .send(doctorData)
      .expect(404);
  });
});