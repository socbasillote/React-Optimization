import { z } from "zod";

export const programSchema = z.object({
  department: z.string().min(1, "Department is required."),

  name: z
    .string()
    .trim()
    .min(2, "Program name must be at least 2 characters.")
    .max(100, "Program name must not exceed 100 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Program code must be at least 2 characters.")
    .max(20, "Program code must not exceed 20 characters."),

  description: z.string().optional(),

  degreeType: z.enum([
    "CERTIFICATE",
    "DIPLOMA",
    "ASSOCIATE",
    "BACHELOR",
    "MASTER",
    "DOCTORATE",
  ]),

  durationYears: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 year.")
    .max(10, "Duration must not exceed 10 years."),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
