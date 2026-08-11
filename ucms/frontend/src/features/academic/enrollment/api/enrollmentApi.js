import { apiSlice } from "@/services/api/apiSlice";

export const enrollmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query({
      query: (params) => ({
        url: "academic/enrollments",
        params,
      }),
      providesTags: ["Enrollment"],
    }),

    getEnrollmentById: builder.query({
      query: (id) => `academic/enrollments/${id}`,
      providesTags: (result, error, id) => [{ type: "Enrollment", id }],
    }),

    createEnrollment: builder.mutation({
      query: (body) => ({
        url: "academic/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollment"],
    }),

    updateEnrollment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/enrollments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Enrollment"],
    }),

    deleteEnrollment: builder.mutation({
      query: (id) => ({
        url: `academic/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useLazyGetEnrollmentByIdQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = enrollmentApi;
