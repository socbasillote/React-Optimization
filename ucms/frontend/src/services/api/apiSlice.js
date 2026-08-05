import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),

  tagTypes: [
    "Auth",

    "User",

    "Campus",
    "College",
    "Department",
    "Program",

    "AcademicYear",
    "AcademicTerm",

    "Curriculum",
    "Subject",
    "CurriculumSubject",

    "Section",

    "Student",
    "Faculty",

    "CourseOffering",
    "Enrollment",

    "ClassSchedule",

    "Attendance",
    "Grade",

    "Assignment",
    "AssignmentSubmission",

    "Quiz",
    "QuizSubmission",

    "Announcement",

    "Dashboard",
  ],

  endpoints: () => ({}),
});
