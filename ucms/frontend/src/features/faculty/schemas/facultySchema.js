import { z } from "zod";

export const facultySchema = z.object({
  user: z.string().min(1, "Faculty user is required."),
  employeeId: z
    .string()
    .trim()
    .min(3, "Employee ID must be at least 3 characters.")
    .max(30),
  department: z.string().min(1, "Department is required."),
  position: z.string().trim().min(1, "Position is required.").max(100),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
