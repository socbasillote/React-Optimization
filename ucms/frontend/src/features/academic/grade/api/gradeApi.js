import { apiSlice } from "@/services/api/apiSlice";

export const gradeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGrades: builder.query({
      query: (params) => ({
        url: "academic/grades",
        params,
      }),
      providesTags: ["Grade"],
    }),

    getGradeById: builder.query({
      query: (id) => `academic/grades/${id}`,
      providesTags: (result, error, id) => [{ type: "Grade", id }],
    }),

    createGrade: builder.mutation({
      query: (body) => ({
        url: "academic/grades",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grade"],
    }),

    updateGrade: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/grades/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Grade"],
    }),

    deleteGrade: builder.mutation({
      query: (id) => ({
        url: `academic/grades/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grade"],
    }),
  }),
});

export const {
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradeApi;
