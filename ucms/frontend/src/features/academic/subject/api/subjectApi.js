import { apiSlice } from "@/services/api/apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: (params) => ({
        url: "academic/subjects",
        params,
      }),
      providesTags: ["Subject"],
    }),

    getSubjectById: builder.query({
      query: (id) => `academic/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: "Subject", id }],
    }),

    createSubject: builder.mutation({
      query: (body) => ({
        url: "academic/subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    updateSubject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/subjects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `academic/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
