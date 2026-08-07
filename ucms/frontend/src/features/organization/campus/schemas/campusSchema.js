import { z } from "zod";

export const campusSchema = z.object({
  name: z.string().trim().min(1, "Campus name is required."),

  code: z.string().trim().min(1, "Campus code is required."),

  address: z.string().trim(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
