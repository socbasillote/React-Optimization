import { apiSlice } from "@/services/api/apiSlice";

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: (params) => ({
        url: "organization/departments",
        params,
      }),
      providesTags: ["Department"],
    }),

    getDepartmentById: builder.query({
      query: (id) => `organization/departments/${id}`,
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),

    createDepartment: builder.mutation({
      query: (body) => ({
        url: "organization/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    updateDepartment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `organization/departments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `organization/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
