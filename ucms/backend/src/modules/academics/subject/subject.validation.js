import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const subjectBodySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  title: z.string().trim().min(2).max(150),

  description: z.string().trim().optional(),

  units: z.number().min(1),

  lectureHours: z.number().min(0).optional(),

  laboratoryHours: z.number().min(0).optional(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createSubjectSchema = z.object({
  body: subjectBodySchema,
});

export const updateSubjectSchema = z.object({
  body: subjectBodySchema.partial(),

  params: z.object({
    id: z.string(),
  }),
});

export const getSubjectSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteSubjectSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
