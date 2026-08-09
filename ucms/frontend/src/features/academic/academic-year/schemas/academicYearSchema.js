import { z } from "zod";

export const academicYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{4}$/, "Academic year must be in YYYY-YYYY format."),

    startDate: z.string().min(1, "Start date is required."),

    endDate: z.string().min(1, "End date is required."),

    isCurrent: z.boolean(),

    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date.",
    path: ["endDate"],
  });
