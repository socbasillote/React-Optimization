import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";
import { DEGREE_TYPES } from "../../../constants/degreeTypes.js";

export const createProgramSchema = z.object({
  body: z.object({
    department: z.string().trim(),

    name: z.string().trim().min(2).max(100),

    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    description: z.string().trim().optional(),

    durationYears: z.number().int().min(1).max(10),

    degreeType: z.enum(Object.values(DEGREE_TYPES)),

    status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
  }),
});

export const updateProgramSchema = z.object({
  body: createProgramSchema.shape.body.partial(),
});
