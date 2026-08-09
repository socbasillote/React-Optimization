import { apiSlice } from "@/services/api/apiSlice";

export const academicTermApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicTerms: builder.query({
      query: (params) => ({
        url: "academic/academic-terms",
        params,
      }),
      providesTags: ["AcademicTerm"],
    }),

    getAcademicTermById: builder.query({
      query: (id) => `academic/academic-terms/${id}`,
      providesTags: (result, error, id) => [{ type: "AcademicTerm", id }],
    }),

    createAcademicTerm: builder.mutation({
      query: (body) => ({
        url: "academic/academic-terms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AcademicTerm"],
    }),

    updateAcademicTerm: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/academic-terms/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AcademicTerm"],
    }),

    deleteAcademicTerm: builder.mutation({
      query: (id) => ({
        url: `academic/academic-terms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicTerm"],
    }),
  }),
});

export const {
  useGetAcademicTermsQuery,
  useGetAcademicTermByIdQuery,
  useCreateAcademicTermMutation,
  useUpdateAcademicTermMutation,
  useDeleteAcademicTermMutation,
} = academicTermApi;
