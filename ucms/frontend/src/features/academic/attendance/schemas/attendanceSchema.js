import { z } from "zod";

export const attendanceSchema = z.object({
  enrollment: z.string().min(1, "Enrollment is required."),
  classSchedule: z.string().min(1, "Class schedule is required."),
  date: z.string().min(1, "Date is required."),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z
    .string()
    .max(500, "Remarks cannot exceed 500 characters.")
    .optional(),
});
