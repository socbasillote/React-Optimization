import { z } from "zod";

export const studentSchema = z.object({
  user: z.string().min(1, "User is required."),
  studentNumber: z
    .string()
    .trim()
    .min(3, "Student number must be at least 3 characters.")
    .max(30, "Student number must not exceed 30 characters."),

  program: z.string().min(1, "Program is required."),
  curriculum: z.string().min(1, "Curriculum is required."),

  section: z.string().optional(),

  yearLevel: z.coerce.number().int().min(1, "Year level must be at least 1."),

  admissionDate: z.string().min(1, "Admission date is required."),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
