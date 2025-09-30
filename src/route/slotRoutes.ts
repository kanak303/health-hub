import { Router } from "express";
import { createSlots, getSlots, bookSlot, cancelSlot, updateSlot } from "../controller/slotController";

const router = Router();

router.post("/create", createSlots);
router.get("/", getSlots);
router.post("/book", bookSlot);
router.put("/update/:slotId", updateSlot);
router.post("/cancel", cancelSlot);

export default router;
