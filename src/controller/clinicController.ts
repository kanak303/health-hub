import { Request, Response } from "express";
import { z } from "zod";
import Clinic from "../modules/clinic/clinicModels";

const createClinicSchema = z.object({
  hospitalName: z.string().min(2),
  doctorName: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  address: z.string().optional(),
  phone: z.string().optional()
});

const updateClinicSchema = createClinicSchema.partial();
// create clinic
export const createClinic = async (req: Request, res: Response) => {
  try {
    const data = createClinicSchema.parse(req.body);
    const clinic = await Clinic.create(data);
    res.status(201).json({ clinic });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Slug already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

// get all clinics
export const getAllClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await Clinic.findAll();
    res.json({ clinics });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// get single clinic
export const getClinic = async (req: Request, res: Response) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }
    res.json({ clinic });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClinic = async (req: Request, res: Response) => {
  try {
    const data = updateClinicSchema.parse(req.body);
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }
    await clinic.update(data);
    res.json({ clinic });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
// delete clinic 
export const deleteClinic = async (req: Request, res: Response) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }
    await clinic.destroy();
    res.json({ message: "Clinic successfully deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};