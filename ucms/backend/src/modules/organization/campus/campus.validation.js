import { z } from "zod";

export const createCampusSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),

    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    address: z.string().trim().optional(),

    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
});

export const updateCampusSchema = createCampusSchema.partial();
