import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const curriculumSubjectBodySchema = z.object({
  curriculum: z.string().trim(),

  subject: z.string().trim(),

  yearLevel: z.number().min(1),

  term: z.number().min(1),

  prerequisite: z.string().trim().nullable().optional(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createCurriculumSubjectSchema = z.object({
  body: curriculumSubjectBodySchema,
});

export const updateCurriculumSubjectSchema = z.object({
  body: curriculumSubjectBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getCurriculumSubjectSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteCurriculumSubjectSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
