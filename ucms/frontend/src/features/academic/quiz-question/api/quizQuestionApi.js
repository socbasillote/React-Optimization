import { apiSlice } from "@/services/api/apiSlice";

export const quizQuestionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizQuestions: builder.query({
      query: ({ quiz, page = 1, limit = 100 }) => ({
        url: "/academic/quiz-questions",
        params: {
          quiz,
          page,
          limit,
        },
      }),

      providesTags: (result, error, { quiz }) => [
        { type: "QuizQuestion", id: `QUIZ-${quiz}` },
      ],
    }),

    getQuizQuestionById: builder.query({
      query: (id) => ({
        url: `/academic/quiz-questions/${id}`,
      }),

      providesTags: (result, error, id) => [{ type: "QuizQuestion", id }],
    }),

    createQuizQuestion: builder.mutation({
      query: (body) => ({
        url: "/academic/quiz-questions",
        method: "POST",
        body,
      }),

      invalidatesTags: (result, error, body) => [
        {
          type: "QuizQuestion",
          id: `QUIZ-${body.quiz}`,
        },
      ],
    }),

    updateQuizQuestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/academic/quiz-questions/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "QuizQuestion", id },
      ],
    }),

    deleteQuizQuestion: builder.mutation({
      query: (id) => ({
        url: `/academic/quiz-questions/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [{ type: "QuizQuestion", id }],
    }),
  }),
});

export const {
  useGetQuizQuestionsQuery,
  useGetQuizQuestionByIdQuery,
  useCreateQuizQuestionMutation,
  useUpdateQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
} = quizQuestionApi;
