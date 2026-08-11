import { apiSlice } from "@/services/api/apiSlice";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: (params) => ({
        url: "academic/assignments",
        params,
      }),
      providesTags: ["Assignment"],
    }),

    getAssignmentById: builder.query({
      query: (id) => `academic/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),

    createAssignment: builder.mutation({
      query: (body) => ({
        url: "academic/assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignment"],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/assignments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Assignment"],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `academic/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;
