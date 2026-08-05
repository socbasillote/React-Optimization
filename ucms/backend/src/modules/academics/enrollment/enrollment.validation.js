import { z } from "zod";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";

const enrollmentBodySchema = z.object({
  student: z.string().trim(),

  courseOffering: z.string().trim(),

  status: z.enum(Object.values(ENROLLMENT_STATUS)).optional(),
});

export const createEnrollmentSchema = z.object({
  body: enrollmentBodySchema,
});

export const updateEnrollmentSchema = z.object({
  body: enrollmentBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
