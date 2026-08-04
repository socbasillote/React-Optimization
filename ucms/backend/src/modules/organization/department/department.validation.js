import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

export const createDepartmentSchema = z.object({
  body: z.object({
    college: z.string().trim(),

    name: z.string().trim().min(2).max(100),

    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    description: z.string().trim().optional(),

    chairperson: z.string().trim().optional(),

    status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: createDepartmentSchema.shape.body.partial(),
});
