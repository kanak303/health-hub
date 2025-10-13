import request from 'supertest';
import assert from 'assert';
import { 
  createBookingTestApp, 
  setupBookingTestDB, 
  getSampleBooking, 
  cleanupBookings, 
  cleanupBookingUsers,
  TestBooking
} from './bookingTestSetup';

const app = createBookingTestApp();

describe('View Booking', () => {
  let bookingId: string;

  before(async () => {
    await setupBookingTestDB();
  });

  beforeEach(async () => {
    await cleanupBookings();
    
    // Create a test booking
    const sampleBooking = getSampleBooking();
    const booking = await TestBooking.create({
      ...sampleBooking,
      status: 'confirmed',
      paymentStatus: 'paid'
    });
    bookingId = booking.id;
  });

  after(async () => {
    await cleanupBookingUsers();
  });

  it('should get all bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .expect(200);

    assert(Array.isArray(res.body.bookings));
    assert.strictEqual(res.body.bookings.length, 1);
    assert.strictEqual(res.body.bookings[0].status, 'confirmed');
  });

  it('should get a booking by ID', async () => {
    const res = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .expect(200);

    assert.strictEqual(res.body.booking.id, bookingId);
    assert.strictEqual(res.body.booking.status, 'confirmed');
  });

  it('should return 404 for non-existent booking', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174999';
    
    await request(app)
      .get(`/api/bookings/${fakeId}`)
      .expect(404);
  });
});