import { Router } from "express";
import { holdSlot, releaseHold } from "../controller/slotHoldController";
import { cleanExpiredHolds } from "../middleware/slotHold";

const router = Router();

/**
 * @swagger
 * /api/slots/hold:
 *   post:
 *     summary: Hold a slot temporarily
 *     description: Temporarily hold a slot for a user to prevent others from booking it
 *     tags: [Slot Holds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HoldSlotRequest'
 *     responses:
 *       200:
 *         description: Slot held successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Slot held successfully"
 *                 hold:
 *                   $ref: '#/components/schemas/SlotHold'
 *       400:
 *         description: Slot already held or booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Slot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/hold", cleanExpiredHolds, holdSlot);

/**
 * @swagger
 * /api/slots/hold/{slotId}:
 *   delete:
 *     summary: Release a slot hold
 *     description: Release a temporary hold on a slot
 *     tags: [Slot Holds]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Slot's unique identifier
 *     responses:
 *       200:
 *         description: Hold released successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hold released successfully"
 *       404:
 *         description: Hold not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/hold/:slotId", releaseHold);

export default router;