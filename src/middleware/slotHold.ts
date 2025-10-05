import { Request, Response, NextFunction } from "express";
import SlotHold from "../modules/slots/slotHoldModel";
import { Op } from "sequelize";

// Middleware to clean expired holds
export const cleanExpiredHolds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await SlotHold.destroy({
      where: { expiresAt: { [Op.lt]: new Date() } }
    });
    next();
  } catch (error) {
    console.error('Error cleaning expired holds:', error);
    next(); // Continue even if cleanup fails
  }
};