import { z } from "zod";

const quizFieldsSchema = {
  courseOffering: z.string().trim(),

  title: z.string().trim().min(1),

  description: z.string().trim().optional(),

  availableFrom: z.coerce.date(),

  dueDate: z.coerce.date(),

  timeLimit: z.number().int().positive(),

  maxScore: z.number().positive(),
};

// CREATE
const createQuizBodySchema = z
  .object(quizFieldsSchema)
  .refine((data) => data.availableFrom <= data.dueDate, {
    path: ["dueDate"],
    message: "Due date must be after the available date.",
  });

export const createQuizSchema = z.object({
  body: createQuizBodySchema,
});

// UPDATE
const updateQuizBodySchema = z
  .object({
    courseOffering: z.string().trim().optional(),

    title: z.string().trim().min(1).optional(),

    description: z.string().trim().optional(),

    availableFrom: z.coerce.date().optional(),

    dueDate: z.coerce.date().optional(),

    timeLimit: z.number().int().positive().optional(),

    maxScore: z.number().positive().optional(),
  })
  .refine(
    (data) =>
      !data.availableFrom ||
      !data.dueDate ||
      data.availableFrom <= data.dueDate,
    {
      path: ["dueDate"],
      message: "Due date must be after the available date.",
    },
  );

export const updateQuizSchema = z.object({
  body: updateQuizBodySchema,

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getQuizSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteQuizSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
