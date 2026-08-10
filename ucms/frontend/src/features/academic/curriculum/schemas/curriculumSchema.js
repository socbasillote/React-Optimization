import { z } from "zod";

export const curriculumSchema = z.object({
  program: z.string().min(1, "Program is required."),

  name: z
    .string()
    .trim()
    .min(2, "Curriculum name must be at least 2 characters.")
    .max(100, "Curriculum name must not exceed 100 characters."),

  description: z.string().trim().optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
