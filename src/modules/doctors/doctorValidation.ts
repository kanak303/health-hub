import { z } from 'zod';

export const createDoctorSchema = z.object({
  userId: z.string().uuid("Invalid user ID format").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  experience: z.number().min(0, "Experience must be 0 or greater"),
  qualification: z.string().min(2, "Qualification is required"),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  consultationFee: z.number().min(0, "Consultation fee must be 0 or greater"),
  availability: z.object({}).passthrough(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  clinicId: z.string().uuid("Invalid clinic ID format")
}).refine(
  (data) => data.userId || (data.email && data.password),
  {
    message: "Either userId or both email and password must be provided",
    path: ["userId"]
  }
);

export const updateDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  specialty: z.string().min(2, "Specialty is required").optional(),
  experience: z.number().min(0, "Experience must be 0 or greater").optional(),
  qualification: z.string().min(2, "Qualification is required").optional(),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters").optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number format").optional(),
  consultationFee: z.number().min(0, "Consultation fee must be 0 or greater").optional(),
  availability: z.object({}).passthrough().optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  isActive: z.boolean().optional()
});