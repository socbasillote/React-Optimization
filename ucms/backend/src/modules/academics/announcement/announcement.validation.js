import { z } from "zod";

const announcementBodySchema = z.object({
  courseOffering: z.string().trim(),

  title: z.string().trim().min(1),

  content: z.string().trim().min(1),

  publishedAt: z.coerce.date().optional(),
});

export const createAnnouncementSchema = z.object({
  body: announcementBodySchema,
});

export const updateAnnouncementSchema = z.object({
  body: announcementBodySchema.partial(),
});
