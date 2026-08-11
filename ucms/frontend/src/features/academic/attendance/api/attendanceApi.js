import { apiSlice } from "@/services/api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: (params) => ({
        url: "academic/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),

    getAttendanceById: builder.query({
      query: (id) => `academic/attendance/${id}`,
      providesTags: (result, error, id) => [{ type: "Attendance", id }],
    }),

    createAttendance: builder.mutation({
      query: (body) => ({
        url: "academic/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    updateAttendance: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/attendance/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `academic/attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceByIdQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
