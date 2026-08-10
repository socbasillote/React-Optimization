import { z } from "zod";

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

export const userRoleSchema = z.object({
  role: z.enum(["ADMIN", "FACULTY", "STUDENT"]),
});
