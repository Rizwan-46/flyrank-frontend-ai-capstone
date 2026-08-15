import { z } from "zod";

export const vaccinationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Vaccination name is required.")
      .min(2, "Name must be at least 2 characters."),
    administeredDate: z
      .string()
      .min(1, "Administered date is required.")
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Please enter a valid date.",
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: "Administered date cannot be in the future.",
      }),
    nextDueDate: z
      .string()
      .min(1, "Next due date is required.")
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Please enter a valid date.",
      }),
    veterinarian: z.string().min(1, "Veterinarian name is required."),
    notes: z
      .string()
      .max(1000, "Notes must be under 1000 characters.")
      .optional()
      .default(""),
  })
  .refine(
    (data) => new Date(data.nextDueDate) > new Date(data.administeredDate),
    {
      message: "Next due date must be after the administered date.",
      path: ["nextDueDate"],
    }
  );

export const completeVaccinationSchema = z
  .object({
    administeredDate: z
      .string()
      .min(1, "Administered date is required.")
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Please enter a valid date.",
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: "Administered date cannot be in the future.",
      }),
    nextDueDate: z
      .string()
      .min(1, "Next due date is required.")
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Please enter a valid date.",
      }),
  })
  .refine(
    (data) => new Date(data.nextDueDate) > new Date(data.administeredDate),
    {
      message: "Next due date must be after the administered date.",
      path: ["nextDueDate"],
    }
  );