import { apiSlice } from "@/services/api/apiSlice";

export const quizSubmissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createQuizSubmission: builder.mutation({
      query: (body) => ({
        url: "/academic/quiz-submissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["QuizSubmission"],
    }),

    getMyQuizSubmissions: builder.query({
      query: ({ page = 1, limit = 100 } = {}) => ({
        url: "/academic/quiz-submissions",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["QuizSubmission"],
    }),

    getQuizSubmissions: builder.query({
      query: ({ page = 1, limit = 10, quiz, enrollment } = {}) => ({
        url: "/academic/quiz-submissions",
        params: {
          page,
          limit,
          ...(quiz ? { quiz } : {}),
          ...(enrollment ? { enrollment } : {}),
        },
      }),
      providesTags: ["QuizSubmission"],
    }),

    getQuizSubmissionById: builder.query({
      query: (id) => `/academic/quiz-submissions/${id}`,
      providesTags: (_result, _error, id) => [
        {
          type: "QuizSubmission",
          id,
        },
      ],
    }),

    updateQuizSubmission: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/academic/quiz-submissions/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["QuizSubmission"],
    }),

    deleteQuizSubmission: builder.mutation({
      query: (id) => ({
        url: `/academic/quiz-submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuizSubmission"],
    }),
  }),
});

export const {
  useCreateQuizSubmissionMutation,
  useGetMyQuizSubmissionsQuery,
  useGetQuizSubmissionsQuery,
  useGetQuizSubmissionByIdQuery,
  useUpdateQuizSubmissionMutation,
  useDeleteQuizSubmissionMutation,
} = quizSubmissionApi;
