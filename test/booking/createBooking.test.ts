import request from 'supertest';
import assert from 'assert';
import { 
  createBookingTestApp, 
  setupBookingTestDB, 
  getSampleBooking, 
  cleanupBookings, 
  cleanupBookingUsers,
  TestBooking,
  TestSlotHold
} from './bookingTestSetup';

const app = createBookingTestApp();

describe('Create Booking', () => {
  before(async () => {
    await setupBookingTestDB();
  });

  beforeEach(async () => {
    await cleanupBookings();
  });

  after(async () => {
    await cleanupBookingUsers();
  });

  it('should create a new booking successfully', async () => {
    const sampleBooking = getSampleBooking();
    
    const res = await request(app)
      .post('/api/bookings')
      .send(sampleBooking)
      .expect(201);

    assert.strictEqual(res.body.booking.status, 'confirmed');
    assert.strictEqual(res.body.booking.paymentStatus, 'paid');
    assert.strictEqual(res.body.booking.userId, sampleBooking.userId);
    assert(res.body.payment.transactionId);
  });

  it('should return 400 for missing payment fields', async () => {
    const invalidBooking = {
      userId: 'test-user-id',
      doctorId: 'test-doctor-id',
      slotId: 'test-slot-id',
      bookingDate: new Date()
    };
    
    await request(app)
      .post('/api/bookings')
      .send(invalidBooking)
      .expect(400);
  });

  it('should return 400 for already booked slot', async () => {
    const sampleBooking = getSampleBooking();
    
    // Create first booking
    await TestBooking.create({
      ...sampleBooking,
      status: 'confirmed'
    });
    
    // Try to book same slot
    await request(app)
      .post('/api/bookings')
      .send(sampleBooking)
      .expect(400);
  });

  it('should return 409 for slot with active hold', async () => {
    const sampleBooking = getSampleBooking();
    
    // Create active hold
    await TestSlotHold.create({
      slotId: sampleBooking.slotId,
      userId: '123e4567-e89b-12d3-a456-426614174003',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });
    
    await request(app)
      .post('/api/bookings')
      .send(sampleBooking)
      .expect(409);
  });
});