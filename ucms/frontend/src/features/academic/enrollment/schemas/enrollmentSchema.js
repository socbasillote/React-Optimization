import { z } from "zod";

export const enrollmentSchema = z.object({
  student: z.string().min(1, "Student is required."),
  courseOffering: z.string().min(1, "Course offering is required."),
  status: z.enum(["ENROLLED", "DROPPED", "COMPLETED", "CANCELLED"]),
});
