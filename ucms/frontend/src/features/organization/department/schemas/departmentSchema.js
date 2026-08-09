import { z } from "zod";

export const departmentSchema = z.object({
  college: z.string().min(1, "College is required."),

  name: z.string().min(1, "Department name is required."),

  code: z.string().min(1, "Department code is required."),

  description: z.string().optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
