import { apiSlice } from "@/services/api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => ({
        url: "students",
        params,
      }),
      providesTags: ["Student"],
    }),

    getCurrentStudent: builder.query({
      query: () => "students/me",
      providesTags: ["Student"],
    }),

    getStudentById: builder.query({
      query: (id) => `students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),

    createStudent: builder.mutation({
      query: (body) => ({
        url: "students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),

    updateStudent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `students/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Student"],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetCurrentStudentQuery,
} = studentApi;
