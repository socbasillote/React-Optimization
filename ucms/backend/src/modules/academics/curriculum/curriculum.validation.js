import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

export const createCurriculumSchema = z.object({
  body: z.object({
    program: z.string().trim(),

    name: z.string().trim().min(2).max(100),

    description: z.string().trim().optional(),

    status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
  }),
});

export const updateCurriculumSchema = createCurriculumSchema.deepPartial();
