import { baseQueryWithReauth } from "@/app/api/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

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
