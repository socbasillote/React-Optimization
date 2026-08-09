import { apiSlice } from "@/services/api/apiSlice";

export const academicYearApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query({
      query: (params) => ({
        url: "academics/academic-years",
        params,
      }),
      providesTags: ["AcademicYear"],
    }),

    getAcademicYearById: builder.query({
      query: (id) => `academic/academic-years/${id}`,
      providesTags: (result, error, id) => [{ type: "AcademicYear", id }],
    }),

    createAcademicYear: builder.mutation({
      query: (body) => ({
        url: "academics/academic-years",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    updateAcademicYear: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academics/academic-years/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    deleteAcademicYear: builder.mutation({
      query: (id) => ({
        url: `academics/academic-years/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicYear"],
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useGetAcademicYearByIdQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
} = academicYearApi;
