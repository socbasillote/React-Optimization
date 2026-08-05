import { z } from "zod";

const assignmentSubmissionBodySchema = z.object({
  assignment: z.string().trim(),

  enrollment: z.string().trim(),

  submittedAt: z.coerce.date().optional(),

  content: z.string().trim().optional(),

  score: z.number().min(0).optional(),

  feedback: z.string().trim().optional(),
});

export const createAssignmentSubmissionSchema = z.object({
  body: assignmentSubmissionBodySchema,
});

export const updateAssignmentSubmissionSchema = z.object({
  body: assignmentSubmissionBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getAssignmentSubmissionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteAssignmentSubmissionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
