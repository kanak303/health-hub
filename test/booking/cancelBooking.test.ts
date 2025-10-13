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

describe('Cancel Booking', () => {
  let paidBookingId: string;
  let pendingBookingId: string;

  before(async () => {
    await setupBookingTestDB();
  });

  beforeEach(async () => {
    await cleanupBookings();
    
    const sampleBooking = getSampleBooking();
    
    // Create paid booking
    const paidBooking = await TestBooking.create({
      ...sampleBooking,
      slotId: '123e4567-e89b-12d3-a456-426614174001',
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: 'test-txn-123'
    });
    paidBookingId = paidBooking.id;
    
    // Create pending booking
    const pendingBooking = await TestBooking.create({
      ...sampleBooking,
      slotId: '123e4567-e89b-12d3-a456-426614174002',
      status: 'pending',
      paymentStatus: 'pending'
    });
    pendingBookingId = pendingBooking.id;
  });

  after(async () => {
    await cleanupBookingUsers();
  });

  it('should cancel paid booking with refund', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${paidBookingId}`)
      .expect(200);

    assert.strictEqual(res.body.message, 'Booking cancelled and refund processed successfully');
    assert.strictEqual(res.body.booking.status, 'cancelled');
    assert.strictEqual(res.body.booking.paymentStatus, 'refunded');
  });

  it('should cancel pending booking without refund', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${pendingBookingId}`)
      .expect(200);

    assert.strictEqual(res.body.message, 'Booking cancelled successfully');
    assert.strictEqual(res.body.booking.status, 'cancelled');
  });

  it('should return 404 for non-existent booking', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174999';
    
    await request(app)
      .delete(`/api/bookings/${fakeId}`)
      .expect(404);
  });

  it('should return 400 for already cancelled booking', async () => {
    // Cancel the booking first
    await request(app)
      .delete(`/api/bookings/${paidBookingId}`)
      .expect(200);
    
    // Try to cancel again
    await request(app)
      .delete(`/api/bookings/${paidBookingId}`)
      .expect(400);
  });
});