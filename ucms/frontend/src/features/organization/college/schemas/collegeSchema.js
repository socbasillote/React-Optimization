import { z } from "zod";

export const collegeSchema = z.object({
  campus: z.string().min(1, "Campus is required."),

  name: z.string().trim().min(1, "College name is required."),

  code: z.string().trim().min(1, "College code is required."),

  description: z.string().trim(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
