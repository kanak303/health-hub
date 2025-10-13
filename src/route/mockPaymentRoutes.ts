import { Router } from 'express';
import { mockPayment, mockRefund } from '../controller/mockPaymentController';

const router = Router();

/**
 * @swagger
 * /api/mock-payment/process:
 *   post:
 *     summary: Mock payment processing for testing
 *     tags: [Mock Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - userId
 *               - bookingId
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150.00
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               bookingId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/process', mockPayment);

/**
 * @swagger
 * /api/mock-payment/refund:
 *   post:
 *     summary: Mock refund processing for testing
 *     tags: [Mock Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - amount
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: "mock_txn_1234567890_abc123"
 *               amount:
 *                 type: number
 *                 example: 150.00
 *               reason:
 *                 type: string
 *                 example: "Booking cancellation"
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/refund', mockRefund);

export default router;