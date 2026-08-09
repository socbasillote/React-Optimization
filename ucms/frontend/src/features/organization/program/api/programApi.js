import { apiSlice } from "@/services/api/apiSlice";

export const programApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query({
      query: (params) => ({
        url: "organization/programs",
        params,
      }),
      providesTags: ["Program"],
    }),

    getProgramById: builder.query({
      query: (id) => `organization/programs/${id}`,
      providesTags: (result, error, id) => [{ type: "Program", id }],
    }),

    createProgram: builder.mutation({
      query: (body) => ({
        url: "organization/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    updateProgram: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `organization/programs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    deleteProgram: builder.mutation({
      query: (id) => ({
        url: `organization/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),
  }),
});

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programApi;
