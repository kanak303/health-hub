import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Slot, SlotAttributes } from "../modules/slots/slotModel";
import { Op } from "sequelize";

// generate slots
function generateSlots(
  doctorId: string,
  date: string,
  startTime: string,
  endTime: string,
  slotDuration: number
): SlotAttributes[] {
  const result: SlotAttributes[] = [];

  let start = new Date(`${date}T${startTime}:00`);
  const end = new Date(`${date}T${endTime}:00`);

  while (start < end) {
    const slotStart = new Date(start);
    const slotEnd = new Date(start.getTime() + slotDuration * 60000);

    if (slotEnd > end) break;

    result.push({
      id: uuidv4(),
      doctorId,
      date,
      startTime: slotStart.toTimeString().slice(0, 5),
      endTime: slotEnd.toTimeString().slice(0, 5),
      status: "available",
    });

    start = slotEnd;
  }

  return result;
}

//  Create Slots
export const createSlots = async (req: Request, res: Response) => {
  try {
    const { doctorId, date, startTime, endTime, slotDuration } = req.body;

    if (!doctorId || !date || !startTime || !endTime || !slotDuration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["doctorId", "date", "startTime", "endTime", "slotDuration"]
      });
    }

    // Check if slots already exist for this doctor on this date
    const existingSlots = await Slot.findAll({
      where: {
        doctorId,
        date,
        startTime: { [Op.gte]: startTime },
        endTime: { [Op.lte]: endTime }
      }
    });

    if (existingSlots.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Slots already exist for this time range"
      });
    }

    const newSlots = generateSlots(doctorId, date, startTime, endTime, slotDuration);
    const createdSlots = await Slot.bulkCreate(newSlots);

    res.json({
      success: true,
      message: "Slots created successfully",
      slots: createdSlots,
      totalSlots: createdSlots.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating slots",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get Available Slots
export const getSlots = async (req: Request, res: Response) => {
  try {
    const { doctorId, date } = req.query;

    const available = await Slot.findAll({
      where: {
        doctorId: doctorId as string,
        date: date as string,
        status: "available"
      }
    });

    res.json({ doctorId, date, availableSlots: available });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching slots",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Book Slot
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { slotId, patientId } = req.body;

    const slot = await Slot.findByPk(slotId);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    if (slot.status !== "available") {
      return res.status(400).json({ success: false, message: "Slot already booked" });
    }

    await slot.update({
      status: "booked",
      patientId
    });

    res.json({
      success: true,
      message: "Slot booked successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking slot",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

//  Update Slot
export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const { startTime, endTime, status } = req.body;

    const slot = await Slot.findByPk(slotId);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    const updates: Partial<SlotAttributes> = {};
    if (startTime) updates.startTime = startTime;
    if (endTime) updates.endTime = endTime;
    if (status) updates.status = status;

    await slot.update(updates);

    res.json({
      success: true,
      message: "Slot updated successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating slot",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Cancel Slot
export const cancelSlot = async (req: Request, res: Response) => {
  try {
    const { slotId, patientId } = req.body;

    const slot = await Slot.findByPk(slotId);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    if (slot.patientId !== patientId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await slot.update({
      status: "available",
      patientId: null
    });

    res.json({
      success: true,
      message: "Slot cancelled successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling slot",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
