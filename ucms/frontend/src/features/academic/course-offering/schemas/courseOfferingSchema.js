import { z } from "zod";

export const courseOfferingSchema = z.object({
  curriculumSubject: z.string().min(1, "Curriculum subject is required."),

  faculty: z.string().min(1, "Faculty is required."),

  section: z.string().min(1, "Section is required."),

  academicYear: z.string().min(1, "Academic year is required."),

  academicTerm: z.string().min(1, "Academic term is required."),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});
