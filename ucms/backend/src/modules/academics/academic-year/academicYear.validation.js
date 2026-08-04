import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

export const createAcademicYearSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{4}$/),

      startDate: z.coerce.date(),

      endDate: z.coerce.date(),

      isCurrent: z.boolean().optional(),

      status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
    })
    .refine((data) => data.startDate < data.endDate, {
      message: "Start date must be before end date.",
      path: ["endDate"],
    }),
});

export const updateAcademicYearSchema = z.object({
  body: z.object({
    role: z.enum(["ADMIN", "FACULTY", "STUDENT"]),
  }),
});
