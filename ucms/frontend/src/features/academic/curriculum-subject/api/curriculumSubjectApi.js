import { apiSlice } from "@/services/api/apiSlice";

export const curriculumSubjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurriculumSubjects: builder.query({
      query: (params) => ({
        url: "academic/curriculum-subjects",
        params,
      }),
      providesTags: ["CurriculumSubject"],
    }),

    getCurriculumSubjectById: builder.query({
      query: (id) => `academic/curriculum-subjects/${id}`,
      providesTags: (result, error, id) => [{ type: "CurriculumSubject", id }],
    }),

    createCurriculumSubject: builder.mutation({
      query: (body) => ({
        url: "academic/curriculum-subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CurriculumSubject"],
    }),

    updateCurriculumSubject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/curriculum-subjects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CurriculumSubject"],
    }),

    deleteCurriculumSubject: builder.mutation({
      query: (id) => ({
        url: `academic/curriculum-subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CurriculumSubject"],
    }),
  }),
});

export const {
  useGetCurriculumSubjectsQuery,
  useGetCurriculumSubjectByIdQuery,
  useCreateCurriculumSubjectMutation,
  useUpdateCurriculumSubjectMutation,
  useDeleteCurriculumSubjectMutation,
} = curriculumSubjectApi;
