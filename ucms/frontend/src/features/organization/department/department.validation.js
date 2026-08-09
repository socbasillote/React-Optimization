import { z } from "zod";

export const createDepartmentSchema = z.object({
  college: z.string().min(1, "College is required."),

  name: z.string().trim().min(1, "Department name is required."),

  code: z.string().trim().min(1, "Department code is required."),

  description: z.string().trim().optional().default(""),

  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateDepartmentSchema = z.object({
  college: z.string().min(1, "College is required.").optional(),

  name: z.string().trim().min(1, "Department name is required.").optional(),

  code: z.string().trim().min(1, "Department code is required.").optional(),

  description: z.string().trim().optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
