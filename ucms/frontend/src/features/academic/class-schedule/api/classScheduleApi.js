import { apiSlice } from "@/services/api/apiSlice";

export const classScheduleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassSchedules: builder.query({
      query: (params) => ({
        url: "academic/class-schedules",
        params,
      }),
      providesTags: ["ClassSchedule"],
    }),

    getClassScheduleById: builder.query({
      query: (id) => `academic/class-schedules/${id}`,
      providesTags: (result, error, id) => [{ type: "ClassSchedule", id }],
    }),

    createClassSchedule: builder.mutation({
      query: (body) => ({
        url: "academic/class-schedules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),

    updateClassSchedule: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/class-schedules/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),

    deleteClassSchedule: builder.mutation({
      query: (id) => ({
        url: `academic/class-schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClassSchedule"],
    }),
  }),
});

export const {
  useGetClassSchedulesQuery,
  useGetClassScheduleByIdQuery,
  useCreateClassScheduleMutation,
  useUpdateClassScheduleMutation,
  useDeleteClassScheduleMutation,
} = classScheduleApi;
