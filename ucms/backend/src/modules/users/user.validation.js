import { z } from "zod";

const genderEnum = ["MALE", "FEMALE", "OTHER"];

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(50).optional(),

    middleName: z.string().trim().max(50).optional(),

    lastName: z.string().trim().min(2).max(50).optional(),

    suffix: z.string().trim().max(20).optional(),

    phone: z.string().trim().max(20).optional(),

    birthDate: z.string().datetime().optional(),

    gender: z.enum(genderEnum).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["ADMIN", "FACULTY", "STUDENT"]),
  }),
});
