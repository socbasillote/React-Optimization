import { z } from "zod";

export const sectionSchema = z.object({
  program: z.string().trim().min(1, "Program is required."),

  academicYear: z.string().trim().min(1, "Academic year is required."),

  academicTerm: z.string().trim().min(1, "Academic term is required."),

  name: z
    .string()
    .trim()
    .min(1, "Section name is required.")
    .max(50, "Section name must not exceed 50 characters."),

  yearLevel: z.coerce
    .number()
    .int("Year level must be a whole number.")
    .min(1, "Year level must be at least 1."),

  adviser: z.string().trim().optional().nullable(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
