import { Router } from "express";
import { createSlots, getSlots, bookSlot, cancelSlot, updateSlot } from "../controller/slotController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/slots/create:
 *   post:
 *     summary: Create time slots for a doctor
 *     description: Generate multiple time slots for a doctor on a specific date with given duration
 *     tags: [Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSlotsRequest'
 *     responses:
 *       200:
 *         description: Slots created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSlotsResponse'
 *       400:
 *         description: Bad request - Missing fields or slots already exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/create", authenticate, authorize(['clinic_admin', 'doctor']), createSlots);

/**
 * @swagger
 * /api/slots:
 *   get:
 *     summary: Get available slots
 *     description: Retrieve available slots with optional filtering by doctor and date
 *     tags: [Slots]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter slots by doctor ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter slots by date (YYYY-MM-DD)
 *         example: '2024-01-27'
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getSlots);

/**
 * @swagger
 * /api/slots/book:
 *   post:
 *     summary: Book a slot
 *     description: Book an available slot for a patient
 *     tags: [Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookSlotRequest'
 *     responses:
 *       200:
 *         description: Slot booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotResponse'
 *       400:
 *         description: Slot already booked
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/book", bookSlot);

/**
 * @swagger
 * /api/slots/update/{slotId}:
 *   put:
 *     summary: Update slot details
 *     description: Update slot timing or status
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Slot's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSlotRequest'
 *     responses:
 *       200:
 *         description: Slot updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotResponse'
 *       404:
 *         description: Slot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/update/:slotId", updateSlot);

/**
 * @swagger
 * /api/slots/cancel:
 *   post:
 *     summary: Cancel a booked slot
 *     description: Cancel a slot booking and make it available again
 *     tags: [Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelSlotRequest'
 *     responses:
 *       200:
 *         description: Slot cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotResponse'
 *       403:
 *         description: Not authorized to cancel this slot
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/cancel", cancelSlot);

export default router;
