import { apiSlice } from "@/services/api/apiSlice";

export const sectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query({
      query: (params) => ({
        url: "academic/sections",
        params,
      }),
      providesTags: ["Section"],
    }),

    getSectionById: builder.query({
      query: (id) => `academic/sections/${id}`,
      providesTags: (result, error, id) => [{ type: "Section", id }],
    }),

    createSection: builder.mutation({
      query: (body) => ({
        url: "academic/sections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Section"],
    }),

    updateSection: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/sections/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Section"],
    }),

    deleteSection: builder.mutation({
      query: (id) => ({
        url: `academic/sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Section"],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi;
