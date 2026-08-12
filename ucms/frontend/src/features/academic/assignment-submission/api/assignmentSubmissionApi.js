import { apiSlice } from "@/services/api/apiSlice";

export const assignmentSubmissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAssignmentSubmission: builder.query({
      query: (assignmentId) =>
        `academic/assignment-submissions/assignment/${assignmentId}/my-submission`,

      providesTags: (result, error, assignmentId) => [
        {
          type: "AssignmentSubmission",
          id: `MY-${assignmentId}`,
        },
      ],
    }),

    createAssignmentSubmission: builder.mutation({
      query: (payload) => ({
        url: "academic/assignment-submissions",
        method: "POST",
        body: payload,
      }),

      invalidatesTags: (result, error, payload) => [
        {
          type: "AssignmentSubmission",
          id: `MY-${payload.assignment}`,
        },
        "AssignmentSubmission",
      ],
    }),

    getAssignmentSubmissions: builder.query({
      query: (params) => ({
        url: "academic/assignment-submissions",
        params,
      }),

      providesTags: ["AssignmentSubmission"],
    }),

    getAssignmentSubmissionById: builder.query({
      query: (id) => `academic/assignment-submissions/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "AssignmentSubmission",
          id,
        },
      ],
    }),
    getMyAssignmentSubmissions: builder.query({
      query: (params) => ({
        url: "academic/assignment-submissions/my-submissions",
        params,
      }),
      providesTags: ["AssignmentSubmission"],
    }),

    updateAssignmentSubmission: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/assignment-submissions/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["AssignmentSubmission"],
    }),
  }),
});

export const {
  useGetMyAssignmentSubmissionsQuery,
  useGetMyAssignmentSubmissionQuery,
  useCreateAssignmentSubmissionMutation,
  useGetAssignmentSubmissionsQuery,
  useGetAssignmentSubmissionByIdQuery,
  useUpdateAssignmentSubmissionMutation,
} = assignmentSubmissionApi;
