import { z } from "zod";

import { DAYS } from "../../../constants/days.js";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const classScheduleFieldsSchema = {
  courseOffering: z.string().trim(),

  day: z.enum(Object.values(DAYS)),

  startTime: z.string().regex(timeRegex, "Invalid time format. Use HH:mm."),

  endTime: z.string().regex(timeRegex, "Invalid time format. Use HH:mm."),

  room: z.string().trim().min(1),
};

// Create validation with time comparison
const createClassScheduleBodySchema = z
  .object(classScheduleFieldsSchema)
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time.",
    path: ["endTime"],
  });

export const createClassScheduleSchema = z.object({
  body: createClassScheduleBodySchema,
});

// PATCH schema
const updateClassScheduleBodySchema = z
  .object({
    courseOffering: z.string().trim().optional(),

    day: z.enum(Object.values(DAYS)).optional(),

    startTime: z
      .string()
      .regex(timeRegex, "Invalid time format. Use HH:mm.")
      .optional(),

    endTime: z
      .string()
      .regex(timeRegex, "Invalid time format. Use HH:mm.")
      .optional(),

    room: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) => !data.startTime || !data.endTime || data.startTime < data.endTime,
    {
      message: "Start time must be before end time.",
      path: ["endTime"],
    },
  );

export const updateClassScheduleSchema = z.object({
  body: updateClassScheduleBodySchema,

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getClassScheduleSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteClassScheduleSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
