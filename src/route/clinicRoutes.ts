import { authenticate } from './../middleware/auth';
import { Router } from "express";
import { createClinic, deleteClinic, getAllClinics, getClinic, updateClinic } from "../controller/clinicController";

const router = Router();

router.post("/", createClinic);
router.get("/", getAllClinics);
router.get("/:id", getClinic);
router.patch("/:id", updateClinic);
router.delete("/:id", deleteClinic);

export default router;