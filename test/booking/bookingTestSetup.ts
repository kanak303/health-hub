import express from 'express';
import testSequelize from '../globalTestConfig';
import { Op } from 'sequelize';

class TestUser extends require('../../src/modules/user/userModels').User {}
class TestBooking extends require('../../src/modules/bookings/bookingModel').default {}
class TestSlotHold extends require('../../src/modules/slots/slotHoldModel').default {}

TestUser.init(TestUser.rawAttributes, { sequelize: testSequelize, modelName: 'User', timestamps: false });
TestBooking.init(TestBooking.rawAttributes, { sequelize: testSequelize, modelName: 'Booking', timestamps: true });
TestSlotHold.init(TestSlotHold.rawAttributes, { sequelize: testSequelize, modelName: 'SlotHold', timestamps: true });

const mockProcessPayment = async (data: any) => ({
  success: true,
  transactionId: 'test-txn-123',
  message: 'Payment successful'
});

const mockProcessRefund = async (data: any) => ({
  success: true,
  refundId: 'test-refund-123',
  message: 'Refund successful'
});

const testCreateBooking = async (req: any, res: any) => {
  try {
    const { slotId, amount, paymentMethod } = req.body;
    
    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: "Amount and payment method are required" });
    }
    
    const existingBooking = await TestBooking.findOne({
      where: { slotId, status: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: "This slot is already booked." });
    }
    
    const activeHold = await TestSlotHold.findOne({
      where: { 
        slotId,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    
    if (activeHold) {
      return res.status(409).json({ 
        error: "This slot is temporarily held by another user."
      });
    }
    
    const booking = await TestBooking.create({
      ...req.body,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    const paymentResult = await mockProcessPayment({ amount, paymentMethod });
    
    if (paymentResult.success) {
      await booking.update({
        status: 'confirmed',
        paymentStatus: 'paid',
        transactionId: paymentResult.transactionId
      });
      
      res.status(201).json({ 
        booking: await booking.reload(),
        payment: paymentResult
      });
    } else {
      await booking.update({
        status: 'cancelled',
        paymentStatus: 'failed'
      });
      
      res.status(400).json({ 
        error: "Booking failed due to payment issue"
      });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const testViewBookings = async (req: any, res: any) => {
  try {
    const bookings = await TestBooking.findAll();
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const testViewBooking = async (req: any, res: any) => {
  try {
    const booking = await TestBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const testCancelBooking = async (req: any, res: any) => {
  try {
    const booking = await TestBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }
    
    if (booking.paymentStatus === 'paid' && booking.transactionId) {
      const refundResult = await mockProcessRefund({
        transactionId: booking.transactionId,
        amount: booking.amount
      });
      
      await booking.update({ 
        status: 'cancelled',
        paymentStatus: 'refunded'
      });
      
      res.json({ 
        message: "Booking cancelled and refund processed successfully",
        booking: await booking.reload()
      });
    } else {
      await booking.update({ status: 'cancelled' });
      res.json({ 
        message: "Booking cancelled successfully",
        booking: await booking.reload()
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBookingTestApp = () => {
  const app = express();
  app.use(express.json());
  
  const router = express.Router();
  router.post('/', testCreateBooking);
  router.get('/', testViewBookings);
  router.get('/:id', testViewBooking);
  router.delete('/:id', testCancelBooking);
  
  app.use('/api/bookings', router);
  return app;
};

let testUserId: string;
let testDoctorId: string;
let testSlotId: string;

export const setupBookingTestDB = async () => {
  await testSequelize.sync({ force: true });
  
  const testUser = await TestUser.create({
    name: 'Test Patient',
    email: 'patient@test.com',
    password: 'hashedpassword',
    role: 'patient',
    isVerified: true
  });
  testUserId = testUser.id;
  
  const testDoctor = await TestUser.create({
    name: 'Test Doctor',
    email: 'doctor@test.com',
    password: 'hashedpassword',
    role: 'doctor',
    isVerified: true
  });
  testDoctorId = testDoctor.id;
  
  testSlotId = '123e4567-e89b-12d3-a456-426614174000';
};

export const getSampleBooking = () => ({
  userId: testUserId,
  doctorId: testDoctorId,
  slotId: testSlotId,
  bookingDate: new Date(),
  amount: 150.00,
  paymentMethod: 'credit_card',
  notes: 'Regular checkup'
});

export const cleanupBookings = async () => {
  await TestBooking.destroy({ where: {}, force: true });
  await TestSlotHold.destroy({ where: {}, force: true });
};

export const cleanupBookingUsers = async () => {
  await TestBooking.destroy({ where: {}, force: true });
  await TestSlotHold.destroy({ where: {}, force: true });
  await TestUser.destroy({ where: {}, force: true });
};

export { TestUser, TestBooking, TestSlotHold };