import { apiSlice } from "./apiSlice";

export const campusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampuses: builder.query({
      query: () => "/campuses",

      providesTags: ["Campus"],
    }),
  }),
});

export const { useGetCampusesQuery } = campusApi;
