import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const sectionBodySchema = z.object({
  program: z.string().trim(),

  academicYear: z.string().trim(),

  academicTerm: z.string().trim(),

  name: z.string().trim().min(1).max(50),

  yearLevel: z.number().min(1),

  adviser: z.string().trim().optional(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createSectionSchema = z.object({
  body: sectionBodySchema,
});

export const updateSectionSchema = z.object({
  body: sectionBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getSectionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteSectionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
