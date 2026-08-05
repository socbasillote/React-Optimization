import { z } from "zod";

import { ATTENDANCE_STATUS } from "../../../constants/attendanceStatus.js";

const attendanceBodySchema = z.object({
  enrollment: z.string().trim(),

  classSchedule: z.string().trim(),

  date: z.coerce.date(),

  status: z.enum(Object.values(ATTENDANCE_STATUS)).optional(),

  remarks: z.string().trim().max(500).optional(),
});

export const createAttendanceSchema = z.object({
  body: attendanceBodySchema,
});

export const updateAttendanceSchema = z.object({
  body: attendanceBodySchema.partial(),

  params: z.object({
    id: z.string().trim(),
  }),
});

export const getAttendanceSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export const deleteAttendanceSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});
