import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const academicTermFieldsSchema = {
  academicYear: z.string().trim(),

  name: z.string().trim().min(2).max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  sequence: z.number().int().min(1),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  isCurrent: z.boolean().optional(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
};

// Create schema with date validation
const academicTermBodySchema = z
  .object(academicTermFieldsSchema)
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date.",
    path: ["endDate"],
  });

export const createAcademicTermSchema = z.object({
  body: academicTermBodySchema,
});

// Update schema without requiring fields
export const updateAcademicTermSchema = z.object({
  body: z
    .object({
      academicYear: z.string().trim().optional(),

      name: z.string().trim().min(2).max(100).optional(),

      code: z
        .string()
        .trim()
        .min(2)
        .max(20)
        .transform((value) => value.toUpperCase())
        .optional(),

      sequence: z.number().int().min(1).optional(),

      startDate: z.coerce.date().optional(),

      endDate: z.coerce.date().optional(),

      isCurrent: z.boolean().optional(),

      status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
    })
    .refine(
      (data) =>
        !data.startDate || !data.endDate || data.startDate < data.endDate,
      {
        message: "Start date must be before end date.",
        path: ["endDate"],
      },
    ),
});
