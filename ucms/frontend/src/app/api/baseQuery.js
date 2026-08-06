import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { clearAccessToken, setAccessToken } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1/",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Determine the request URL
  const url = typeof args === "string" ? args : args.url;

  // Never try to refresh these endpoints
  const shouldSkipRefresh =
    url === "/auth/login" || url === "/auth/refresh" || url === "/auth/logout";

  if (result.error?.status === 401 && !shouldSkipRefresh) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      api.dispatch(setAccessToken(refreshResult.data.data.accessToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAccessToken());
    }
  }

  return result;
};
