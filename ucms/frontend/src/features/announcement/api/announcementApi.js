import { apiSlice } from "@/services/api/apiSlice";

export const announcementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: (params = {}) => ({
        url: "/academics/announcements",
        params,
      }),

      providesTags: ["Announcements"],
    }),
  }),
});

export const { useGetAnnouncementsQuery } = announcementApi;
