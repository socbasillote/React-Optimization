import { apiSlice } from "@/services/api/apiSlice";

export const campusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampuses: builder.query({
      query: (params) => ({
        url: "organization/campuses",
        params,
      }),

      providesTags: ["Campus"],
    }),

    createCampus: builder.mutation({
      query: (body) => ({
        url: "organization/campuses",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Campus"],
    }),

    updateCampus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `organization/campuses/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Campus"],
    }),

    deleteCampus: builder.mutation({
      query: (id) => ({
        url: `organization/campuses/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Campus"],
    }),
  }),
});

export const {
  useGetCampusesQuery,
  useCreateCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} = campusApi;
