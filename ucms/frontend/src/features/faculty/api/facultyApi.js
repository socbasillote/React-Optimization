import { apiSlice } from "@/services/api/apiSlice";

export const facultyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query({
      query: (params) => ({
        url: "faculty",
        params,
      }),
      providesTags: ["Faculty"],
    }),

    getFacultyById: builder.query({
      query: (id) => `faculty/${id}`,
      providesTags: (result, error, id) => [{ type: "Faculty", id }],
    }),

    createFaculty: builder.mutation({
      query: (body) => ({
        url: "faculty",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faculty"],
    }),

    updateFaculty: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `faculty/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Faculty"],
    }),

    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `faculty/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),
  }),
});

export const {
  useGetFacultiesQuery,
  useGetFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
