import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../constants/organizationStatus.js";

const facultyBodySchema = z.object({
  user: z.string().trim(),

  employeeId: z.string().trim().min(3).max(30),

  department: z.string().trim(),

  position: z.string().trim().min(1).max(100),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createFacultySchema = z.object({
  body: facultyBodySchema,
});

export const updateFacultySchema = z.object({
  body: facultyBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getFacultySchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteFacultySchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
