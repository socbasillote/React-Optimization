import { z } from "zod";

const quizQuestionFieldsSchema = {
  quiz: z.string().trim(),

  question: z.string().trim().min(1, "Question is required."),

  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),

  options: z.array(z.string().trim()).optional(),

  correctAnswer: z.string().trim().optional(),

  points: z.number().min(0).optional(),

  order: z.number().int().min(1),
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

const createQuizQuestionBodySchema = z
  .object(quizQuestionFieldsSchema)
  .superRefine((data, ctx) => {
    if (data.type === "MULTIPLE_CHOICE") {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Multiple choice questions require at least two options.",
        });
      }

      if (!data.correctAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Multiple choice questions require a correct answer.",
        });
      }

      if (
        data.correctAnswer &&
        data.options &&
        !data.options.includes(data.correctAnswer)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Correct answer must match one of the options.",
        });
      }
    }

    if (data.type === "TRUE_FALSE") {
      if (
        !["true", "false"].includes(data.correctAnswer?.toLowerCase() ?? "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: 'Correct answer must be "true" or "false".',
        });
      }
    }

    if (data.type === "SHORT_ANSWER") {
      if (!data.correctAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Short answer questions require a correct answer.",
        });
      }
    }
  });

export const createQuizQuestionSchema = z.object({
  body: createQuizQuestionBodySchema,
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
|
| IMPORTANT:
| We do NOT use:
|
| createQuizQuestionBodySchema.omit(...)
|
| because the create schema contains superRefine().
|
| Instead, we create a separate update schema.
|--------------------------------------------------------------------------
*/

const updateQuizQuestionBodySchema = z
  .object({
    question: z.string().trim().min(1, "Question is required.").optional(),

    type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]).optional(),

    options: z.array(z.string().trim()).optional(),

    correctAnswer: z.string().trim().optional(),

    points: z.number().min(0).optional(),

    order: z.number().int().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    /*
     * Only validate these rules when the
     * relevant fields are being updated.
     */

    if (data.type === "MULTIPLE_CHOICE") {
      if (data.options && data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Multiple choice questions require at least two options.",
        });
      }

      if (
        data.correctAnswer &&
        data.options &&
        !data.options.includes(data.correctAnswer)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Correct answer must match one of the options.",
        });
      }
    }

    if (data.type === "TRUE_FALSE" && data.correctAnswer) {
      if (!["true", "false"].includes(data.correctAnswer.toLowerCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: 'Correct answer must be "true" or "false".',
        });
      }
    }
  });

export const updateQuizQuestionSchema = z.object({
  body: updateQuizQuestionBodySchema,

  params: z.object({
    id: z.string().trim(),
  }),
});

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export const getQuizQuestionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteQuizQuestionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
