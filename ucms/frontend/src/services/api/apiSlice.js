import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1/",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    console.log("TOKEN:", token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery,

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
