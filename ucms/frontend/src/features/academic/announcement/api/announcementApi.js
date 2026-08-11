import { apiSlice } from "@/services/api/apiSlice";

export const announcementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: (params) => ({
        url: "academic/announcements",
        params,
      }),
      providesTags: ["Announcement"],
    }),

    getAnnouncementById: builder.query({
      query: (id) => `academic/announcements/${id}`,
      providesTags: (result, error, id) => [{ type: "Announcement", id }],
    }),

    createAnnouncement: builder.mutation({
      query: (body) => ({
        url: "academic/announcements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Announcement"],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `academic/announcements/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Announcement"],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `academic/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
