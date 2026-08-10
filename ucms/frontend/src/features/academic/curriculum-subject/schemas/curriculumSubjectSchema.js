import { z } from "zod";

export const curriculumSubjectSchema = z.object({
  curriculum: z.string().trim().min(1, "Curriculum is required."),

  subject: z.string().trim().min(1, "Subject is required."),

  yearLevel: z.coerce
    .number()
    .int("Year level must be a whole number.")
    .min(1, "Year level must be at least 1."),

  term: z.coerce
    .number()
    .int("Term must be a whole number.")
    .min(1, "Term must be at least 1."),

  prerequisite: z.string().trim().optional().nullable(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
