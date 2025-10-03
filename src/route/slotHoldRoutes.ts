import { Router, Request, Response } from "express";
import SlotHold from "../modules/bookings/slotHoldModel";
import Booking from "../modules/bookings/bookingModel";
import { Op } from "sequelize";

const router = Router();

// Hold a slot for 5 minutes
router.post("/hold", async (req: Request, res: Response) => {
  try {
    const { slotId, userId } = req.body;
    
    // Clean expired holds
    await SlotHold.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() }
      }
    });
    
    // Check if slot is already booked or held
    const [existingBooking, existingHold] = await Promise.all([
      Booking.findOne({
        where: { slotId, status: ['pending', 'confirmed'] }
      }),
      SlotHold.findOne({ where: { slotId } })
    ]);
    
    if (existingBooking) {
      return res.status(400).json({ error: "This slot is already booked." });
    }
    
    if (existingHold) {
      return res.status(400).json({ error: "This slot is currently being booked by another user." });
    }
    
    // Create 5 minute hold
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hold = await SlotHold.create({ slotId, userId, expiresAt });
    
    res.json({ 
      message: "Slot Hold successfully",
      holdId: hold.id,
      expiresAt: hold.expiresAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Release hold
router.delete("/hold/:slotId", async (req: Request, res: Response) => {
  try {
    await SlotHold.destroy({ where: { slotId: req.params.slotId } });
    res.json({ message: "Hold released" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;