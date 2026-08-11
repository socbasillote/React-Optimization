import { z } from "zod";

export const quizSchema = z
  .object({
    courseOffering: z.string().trim().min(1, "Course offering is required."),

    title: z.string().trim().min(1, "Title is required."),

    description: z.string().trim().optional(),

    availableFrom: z.string().min(1, "Available date is required."),

    dueDate: z.string().min(1, "Due date is required."),

    timeLimit: z
      .number()
      .int("Time limit must be a whole number.")
      .positive("Time limit must be greater than 0."),

    maxScore: z.number().positive("Maximum score must be greater than 0."),
  })
  .refine(
    (data) =>
      !data.availableFrom ||
      !data.dueDate ||
      new Date(data.availableFrom) <= new Date(data.dueDate),
    {
      message: "Due date must be after the available date.",
      path: ["dueDate"],
    },
  );

export const defaultQuizValues = {
  courseOffering: "",
  title: "",
  description: "",
  availableFrom: "",
  dueDate: "",
  timeLimit: undefined,
  maxScore: undefined,
};
