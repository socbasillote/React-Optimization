import { z } from "zod";

export const academicTermSchema = z
  .object({
    academicYear: z.string().min(1, "Academic year is required."),

    name: z
      .string()
      .trim()
      .min(2, "Term name must be at least 2 characters.")
      .max(100, "Term name must not exceed 100 characters."),

    code: z
      .string()
      .trim()
      .min(2, "Term code must be at least 2 characters.")
      .max(20, "Term code must not exceed 20 characters."),

    sequence: z.coerce.number().int().min(1, "Sequence must be at least 1."),

    startDate: z.string().min(1, "Start date is required."),

    endDate: z.string().min(1, "End date is required."),

    isCurrent: z.boolean(),

    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date.",
    path: ["endDate"],
  });
