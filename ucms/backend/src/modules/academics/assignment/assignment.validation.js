import { z } from "zod";

const assignmentFieldsSchema = {
  courseOffering: z.string().trim(),

  title: z.string().trim().min(1),

  description: z.string().trim().optional(),

  availableFrom: z.coerce.date(),

  dueDate: z.coerce.date(),

  maxScore: z.number().positive(),
};

// Create
const createAssignmentBodySchema = z
  .object(assignmentFieldsSchema)
  .refine((data) => data.availableFrom <= data.dueDate, {
    message: "Due date must be after the available date.",
    path: ["dueDate"],
  });

export const createAssignmentSchema = z.object({
  body: createAssignmentBodySchema,
});

// Update
const updateAssignmentBodySchema = z
  .object({
    courseOffering: z.string().trim().optional(),

    title: z.string().trim().min(1).optional(),

    description: z.string().trim().optional(),

    availableFrom: z.coerce.date().optional(),

    dueDate: z.coerce.date().optional(),

    maxScore: z.number().positive().optional(),
  })
  .refine(
    (data) =>
      !data.availableFrom ||
      !data.dueDate ||
      data.availableFrom <= data.dueDate,
    {
      message: "Due date must be after the available date.",
      path: ["dueDate"],
    },
  );

export const updateAssignmentSchema = z.object({
  body: updateAssignmentBodySchema,

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getAssignmentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteAssignmentSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
