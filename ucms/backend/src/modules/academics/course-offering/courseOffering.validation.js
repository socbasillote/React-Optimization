import { z } from "zod";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const courseOfferingBodySchema = z.object({
  curriculumSubject: z.string().trim(),

  faculty: z.string().trim(),

  section: z.string().trim(),

  academicYear: z.string().trim(),

  academicTerm: z.string().trim(),

  status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
});

export const createCourseOfferingSchema = z.object({
  body: courseOfferingBodySchema,
});

export const updateCourseOfferingSchema = z.object({
  body: courseOfferingBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getCourseOfferingSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteCourseOfferingSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
