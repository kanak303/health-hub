import express from 'express';
import { 
  createDoctor, 
  getDoctors, 
  getDoctorById, 
  updateDoctor, 
  deleteDoctor 
} from '../controller/doctorController';
import { validate } from '../middleware/validate';
import { createDoctorSchema, updateDoctorSchema } from '../modules/doctors/doctorValidation';

const router = express.Router();

router.post('/', validate(createDoctorSchema), createDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', validate(updateDoctorSchema), updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;