import { z } from "zod";

export const announcementSchema = z.object({
  courseOffering: z.string().trim().min(1, "Course offering is required."),

  title: z.string().trim().min(1, "Title is required."),

  content: z.string().trim().min(1, "Content is required."),

  publishedAt: z.string().min(1, "Published date is required."),
});

export const defaultAnnouncementValues = {
  courseOffering: "",
  title: "",
  content: "",
  publishedAt: "",
};
