import { z } from "zod";

export const assignmentSchema = z
  .object({
    courseOffering: z.string().trim().min(1, "Course offering is required."),

    title: z.string().trim().min(1, "Title is required."),

    description: z.string().trim().optional(),

    availableFrom: z.string().min(1, "Available date is required."),

    dueDate: z.string().min(1, "Due date is required."),

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

export const defaultAssignmentValues = {
  courseOffering: "",
  title: "",
  description: "",
  availableFrom: "",
  dueDate: "",
  maxScore: undefined,
};
