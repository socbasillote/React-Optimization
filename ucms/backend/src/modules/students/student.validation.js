import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../constants/organizationStatus.js";

const studentBodySchema = z.object({
  user: z.string().trim(),

  studentNumber: z.string().trim().min(3).max(30),

  program: z.string().trim(),

  curriculum: z.string().trim(),

  section: z.string().trim().optional(),

  yearLevel: z.number().min(1),

  admissionDate: z.coerce.date(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createStudentSchema = z.object({
  body: studentBodySchema,
});

export const updateStudentSchema = z.object({
  body: studentBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getStudentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteStudentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
