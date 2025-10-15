import express from 'express';
import { createClinicAdmin, createDoctorForClinic, createClinic } from '../controller/clinicAdminController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/clinic-admin:
 *   post:
 *     summary: Create clinic admin profile (Platform Admin only)
 *     tags: [Clinic Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClinicAdminRequest'
 *     responses:
 *       201:
 *         description: Clinic admin created successfully
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
 *                   example: "Clinic admin created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied - Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, authorize(['admin']), createClinicAdmin);

/**
 * @swagger
 * /api/clinic-admin/doctors:
 *   post:
 *     summary: Create doctor for clinic (Clinic Admin only)
 *     tags: [Clinic Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDoctorForClinicRequest'
 *     responses:
 *       201:
 *         description: Doctor created successfully for clinic
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
 *                   example: "Doctor created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       $ref: '#/components/schemas/Doctor'
 *       403:
 *         description: Access denied - Clinic Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Doctor already exists or email taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/doctors', authenticate, authorize(['clinic_admin']), createDoctorForClinic);

/**
 * @swagger
 * /api/clinic-admin/clinics:
 *   post:
 *     summary: Create clinic (Clinic Admin only)
 *     tags: [Clinic Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClinicRequest'
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicResponse'
 *       403:
 *         description: Access denied - Clinic Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - Validation error or slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/clinics', authenticate, authorize(['clinic_admin']), createClinic);

export default router;