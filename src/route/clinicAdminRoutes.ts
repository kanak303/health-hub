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
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 example: "john@clinic.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Clinic admin created successfully
 *       403:
 *         description: Access denied - Admin only
 *       409:
 *         description: User already exists
 */
router.post('/', authenticate, authorize(['admin']), createClinicAdmin);
router.post('/doctors', authenticate, authorize(['clinic_admin']), createDoctorForClinic);
router.post('/clinics', authenticate, authorize(['clinic_admin']), createClinic);

export default router;