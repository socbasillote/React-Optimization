import { apiSlice } from "@/services/api/apiSlice";

export const courseOfferingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseOfferings: builder.query({
      query: (params) => ({
        url: "academic/course-offerings",
        params,
      }),
      providesTags: ["CourseOffering"],
    }),

    getCourseOfferingById: builder.query({
      query: (id) => `academic/course-offerings/${id}`,
      providesTags: (result, error, id) => [{ type: "CourseOffering", id }],
    }),

    createCourseOffering: builder.mutation({
      query: (body) => ({
        url: "academic/course-offerings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseOffering"],
    }),

    updateCourseOffering: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/course-offerings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CourseOffering"],
    }),

    deleteCourseOffering: builder.mutation({
      query: (id) => ({
        url: `academic/course-offerings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CourseOffering"],
    }),
  }),
});

export const {
  useGetCourseOfferingsQuery,
  useGetCourseOfferingByIdQuery,
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingMutation,
  useDeleteCourseOfferingMutation,
} = courseOfferingApi;
