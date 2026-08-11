import { z } from "zod";

export const GRADE_REMARKS = ["PASSED", "FAILED", "INCOMPLETE"];

const scoreSchema = z
  .number()
  .min(0, "Score cannot be below 0.")
  .max(100, "Score cannot exceed 100.");

export const gradeSchema = z.object({
  enrollment: z.string().min(1, "Enrollment is required."),

  prelim: scoreSchema.optional(),

  midterm: scoreSchema.optional(),

  final: scoreSchema.optional(),

  finalGrade: scoreSchema.optional(),

  remarks: z.enum(GRADE_REMARKS).optional(),
});

export const defaultGradeValues = {
  enrollment: "",
  prelim: undefined,
  midterm: undefined,
  final: undefined,
  finalGrade: undefined,
  remarks: undefined,
};
