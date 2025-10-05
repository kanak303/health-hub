import { Router } from "express";
import { 
  createBooking, 
  viewBookings, 
  viewBooking, 
  confirmBooking, 
  updateBooking, 
  cancelBooking 
} from "../controller/bookingController";
import { cleanExpiredHolds } from "../middleware/slotHold";

const router = Router();

router.post("/", cleanExpiredHolds, createBooking);
router.get("/", viewBookings);
router.get("/:id", viewBooking);
router.patch("/:id/confirm", confirmBooking);
router.patch("/:id", updateBooking);
router.patch("/:id/cancel", cancelBooking);

export default router;