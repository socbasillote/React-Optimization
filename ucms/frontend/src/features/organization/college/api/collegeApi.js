import { apiSlice } from "@/services/api/apiSlice";

export const collegeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getColleges: builder.query({
      query: (params) => ({
        url: "organization/colleges",
        params,
      }),
      providesTags: ["College"],
    }),

    createCollege: builder.mutation({
      query: (body) => ({
        url: "organization/colleges",
        method: "POST",
        body,
      }),
      invalidatesTags: ["College"],
    }),

    updateCollege: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `organization/colleges/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["College"],
    }),

    deleteCollege: builder.mutation({
      query: (id) => ({
        url: `organization/colleges/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["College"],
    }),
  }),
});

export const {
  useGetCollegesQuery,
  useCreateCollegeMutation,
  useUpdateCollegeMutation,
  useDeleteCollegeMutation,
} = collegeApi;
