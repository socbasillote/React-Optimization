import { z } from "zod";

const answerSchema = z.object({
  question: z.string().trim(),

  answer: z.string().trim().default(""),
});

const quizSubmissionFieldsSchema = {
  quiz: z.string().trim(),

  enrollment: z.string().trim(),

  answers: z.array(answerSchema).default([]),

  startedAt: z.coerce.date().optional(),

  submittedAt: z.coerce.date().optional(),

  score: z.number().min(0).optional(),

  feedback: z.string().trim().optional(),
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

const createQuizSubmissionBodySchema = z
  .object(quizSubmissionFieldsSchema)
  .refine(
    (data) => {
      if (data.startedAt && data.submittedAt) {
        return data.submittedAt >= data.startedAt;
      }

      return true;
    },
    {
      path: ["submittedAt"],
      message: "Submission time cannot be before the start time.",
    },
  );

export const createQuizSubmissionSchema = z.object({
  body: createQuizSubmissionBodySchema,
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

const updateQuizSubmissionBodySchema = z
  .object({
    answers: z.array(answerSchema).optional(),

    startedAt: z.coerce.date().optional(),

    submittedAt: z.coerce.date().optional(),

    score: z.number().min(0).optional(),

    feedback: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.startedAt && data.submittedAt) {
        return data.submittedAt >= data.startedAt;
      }

      return true;
    },
    {
      path: ["submittedAt"],
      message: "Submission time cannot be before the start time.",
    },
  );

export const updateQuizSubmissionSchema = z.object({
  body: updateQuizSubmissionBodySchema,

  params: z.object({
    id: z.string().trim(),
  }),
});

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export const getQuizSubmissionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteQuizSubmissionSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
