import { z } from "zod";

export const departmentSchema = z.object({
  college: z.string().min(1, "College is required."),

  name: z.string().trim().min(1, "Department name is required."),

  code: z.string().trim().min(1, "Department code is required."),

  description: z.string().trim(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
