import { z } from "zod";

import { GRADE_REMARKS } from "../../../constants/gradeRemarks.js";

const score = z.number().min(0).max(100);

const gradeBodySchema = z.object({
  enrollment: z.string().trim(),

  prelim: score.optional(),

  midterm: score.optional(),

  final: score.optional(),

  finalGrade: score.optional(),

  remarks: z.enum(Object.values(GRADE_REMARKS)).optional(),
});

export const createGradeSchema = z.object({
  body: gradeBodySchema,
});

export const updateGradeSchema = z.object({
  body: gradeBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getGradeSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteGradeSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
