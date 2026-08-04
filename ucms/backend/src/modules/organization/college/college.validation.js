import { z } from "zod";
import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const statusEnum = ["ACTIVE", "INACTIVE"];

export const createCollegeSchema = z.object({
  body: z.object({
    campus: z.string().trim(),

    name: z.string().trim().min(2).max(100),

    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    description: z.string().trim().optional(),

    dean: z.string().trim().optional(),

    status: z.enum(Object.values(ORGANIZATION_STATUS)).optional(),
  }),
});

export const updateCollegeSchema = z.object({
  body: createCollegeSchema.shape.body.partial(),
});
