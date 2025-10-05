import { Router } from "express";
import { holdSlot, releaseHold } from "../controller/slotHoldController";
import { cleanExpiredHolds } from "../middleware/slotHold";

const router = Router();

router.post("/hold", cleanExpiredHolds, holdSlot);
router.delete("/hold/:slotId", releaseHold);

export default router;