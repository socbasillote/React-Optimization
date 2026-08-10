import { apiSlice } from "@/services/api/apiSlice";

export const curriculumApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurricula: builder.query({
      query: (params) => ({
        url: "academic/curricula",
        params,
      }),
      providesTags: ["Curriculum"],
    }),

    getCurriculumById: builder.query({
      query: (id) => `academic/curricula/${id}`,
      providesTags: (result, error, id) => [{ type: "Curriculum", id }],
    }),

    createCurriculum: builder.mutation({
      query: (body) => ({
        url: "academic/curricula",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Curriculum"],
    }),

    updateCurriculum: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/curricula/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Curriculum"],
    }),

    deleteCurriculum: builder.mutation({
      query: (id) => ({
        url: `academic/curricula/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Curriculum"],
    }),
  }),
});

export const {
  useGetCurriculaQuery,
  useGetCurriculumByIdQuery,
  useCreateCurriculumMutation,
  useUpdateCurriculumMutation,
  useDeleteCurriculumMutation,
} = curriculumApi;
