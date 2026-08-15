import { z } from "zod";

export const petSchema = z.object({
  name: z
    .string()
    .min(1, "Pet name is required.")
    .min(2, "Name must be at least 2 characters."),
  species: z.string().min(1, "Species is required."),
  breed: z.string().min(1, "Breed is required."),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please enter a valid date.",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date of birth cannot be in the future.",
    }),
  weight: z.coerce
    .number({ invalid_type_error: "Weight must be a number." })
    .positive("Weight must be greater than 0.")
    .max(200, "Please enter a realistic weight."),
  allergies: z.string().optional().default(""),
  microchipId: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});