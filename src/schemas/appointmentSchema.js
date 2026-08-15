import { z } from "zod";

export const appointmentSchema = z.object({
  petId: z.string().min(1, "Please select a pet."),
  date: z
    .string()
    .min(1, "Date is required.")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please enter a valid date.",
    }),
  time: z.string().min(1, "Time is required."),
  reason: z
    .string()
    .min(1, "Reason is required.")
    .min(3, "Please provide a bit more detail."),
  veterinarian: z.string().min(1, "Veterinarian name is required."),
  notes: z
    .string()
    .max(1000, "Notes must be under 1000 characters.")
    .optional()
    .default(""),
});