import { z } from "zod";

export const medicalRecordSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required.")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please enter a valid date.",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date cannot be in the future.",
    }),
  reason: z
    .string()
    .min(1, "Visit/reason is required.")
    .min(3, "Please provide a bit more detail."),
  diagnosis: z.string().min(1, "Diagnosis is required."),
  treatment: z.string().min(1, "Treatment is required."),
  veterinarian: z.string().min(1, "Veterinarian name is required."),
  notes: z
    .string()
    .max(2000, "Notes must be under 2000 characters.")
    .optional()
    .default(""),
});