import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const classScheduleSchema = z
  .object({
    courseOffering: z.string().trim().min(1, "Course offering is required."),
    day: z.string().trim().min(1, "Day is required."),
    startTime: z.string().regex(timeRegex, "Invalid time format."),
    endTime: z.string().regex(timeRegex, "Invalid time format."),
    room: z.string().trim().min(1, "Room is required."),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time.",
    path: ["endTime"],
  });
