import { z } from "zod";

export const subjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Subject code must be at least 2 characters.")
    .max(20, "Subject code must not exceed 20 characters."),

  title: z
    .string()
    .trim()
    .min(2, "Subject title must be at least 2 characters.")
    .max(150, "Subject title must not exceed 150 characters."),

  description: z.string().trim().optional(),

  units: z.coerce.number().min(1, "Units must be at least 1."),

  lectureHours: z.coerce.number().min(0, "Lecture hours cannot be negative."),

  laboratoryHours: z.coerce
    .number()
    .min(0, "Laboratory hours cannot be negative."),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
