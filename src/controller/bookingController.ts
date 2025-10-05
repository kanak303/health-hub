import { Request, Response } from "express";
import Booking from "../modules/bookings/bookingModel";
import SlotHold from "../modules/slots/slotHoldModel";
import { processPayment, processRefund } from "../utils/paymentService";
import { Op } from "sequelize";

// Create booking with payment
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { slotId, amount, paymentMethod } = req.body;
    
    // Validate required payment fields
    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: "Amount and payment method are required" });
    }
    
    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      where: { slotId, status: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: "This slot is already booked." });
    }
    
    // Check if slot is temporarily held
    const activeHold = await SlotHold.findOne({
      where: { 
        slotId,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    
    if (activeHold) {
      const timeLeft = Math.ceil((activeHold.expiresAt.getTime() - Date.now()) / 1000 / 60);
      return res.status(409).json({ 
        error: "This slot is temporarily held by another user.",
        message: `Please try again in ${timeLeft} minute(s).`,
        availableAt: activeHold.expiresAt
      });
    }
    
    // Create booking with pending payment
    const booking = await Booking.create({
      ...req.body,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    // Process payment
    const paymentResult = await processPayment({
      amount,
      currency: 'USD',
      paymentMethod,
      userId: req.body.userId,
      bookingId: booking.id
    });
    
    if (paymentResult.success) {
      // Update booking with payment success
      await booking.update({
        status: 'confirmed',
        paymentStatus: 'paid',
        transactionId: paymentResult.transactionId
      });
      
      // Release hold if exists
      await SlotHold.destroy({ where: { slotId } });
      
      res.status(201).json({ 
        booking: await booking.reload(),
        payment: paymentResult
      });
    } else {
      // Update booking with payment failure
      await booking.update({
        status: 'cancelled',
        paymentStatus: 'failed'
      });
      
      res.status(400).json({ 
        error: "Booking failed due to payment issue",
        message: paymentResult.message,
        booking: await booking.reload()
      });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings
export const viewBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll();
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get single booking
export const viewBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm booking
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    await booking.update({ status: 'confirmed' });
    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    await booking.update(req.body);
    res.json({ message: "Booking updated successfully", booking });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel booking with refund
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ error: "Cannot cancel completed booking" });
    }
    
    // Process refund if payment was made
    if (booking.paymentStatus === 'paid' && booking.transactionId) {
      const refundResult = await processRefund({
        transactionId: booking.transactionId,
        amount: booking.amount,
        reason: "Booking cancellation"
      });
      
      if (refundResult.success) {
        await booking.update({ 
          status: 'cancelled',
          paymentStatus: 'refunded'
        });
        
        res.json({ 
          message: "Booking cancelled and refund processed successfully",
          booking: await booking.reload(),
          refund: refundResult
        });
      } else {
        // Cancel booking but mark refund as failed
        await booking.update({ status: 'cancelled' });
        
        res.status(400).json({ 
          message: "Booking cancelled but refund failed",
          error: refundResult.message,
          booking: await booking.reload()
        });
      }
    } else {
      // No payment to refund, just cancel
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