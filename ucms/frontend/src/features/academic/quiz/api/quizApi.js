import { apiSlice } from "@/services/api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: (params) => ({
        url: "academic/quizzes",
        params,
      }),
      providesTags: ["Quiz"],
    }),

    getQuizById: builder.query({
      query: (id) => `academic/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: "Quiz", id }],
    }),

    createQuiz: builder.mutation({
      query: (body) => ({
        url: "academic/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),

    updateQuiz: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/quizzes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),

    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `academic/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizApi;
