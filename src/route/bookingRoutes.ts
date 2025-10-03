import { Router } from "express";
import { Request, Response } from "express";
import Booking from "../modules/bookings/bookingModel";
import SlotHold from "../modules/bookings/slotHoldModel";
import { Op } from "sequelize";

const router = Router();

// Create booking
router.post("/", async (req: Request, res: Response) => {
  try {
    const { slotId } = req.body;
    
    // Clean expired holds first
    await SlotHold.destroy({
      where: { expiresAt: { [Op.lt]: new Date() } }
    });
    
    // Check if slot is permanently booked
    const existingBooking = await Booking.findOne({
      where: { slotId, status: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: "This slot is already booked." });
    }
    
    // Check if slot is temporarily held (not expired)
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
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({ booking });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings
router.get("/", async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll();
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;