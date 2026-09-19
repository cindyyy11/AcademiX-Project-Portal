import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useEffect, useState } from "react";
import { userLoggedIn } from "../auth/authSlice";

// Demo mode lets someone explore the dashboard without a real backend
// session: it short-circuits `useLoadUserQuery` with a canned user instead
// of skipping auth checks on the server.
export const DEMO_MODE_STORAGE_KEY = "academix-demo-mode";

export const DEMO_USER = {
  name: "Demo Student",
  email: "demo.student@academix.io",
  role: "student",
  avatar: { url: "/images/avatars.jpg" },
};

export const isDemoMode = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) === "true";
};

export const enterDemoMode = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, "true");
};

export const exitDemoMode = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: (data) => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: (data) => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});


export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

// Drop-in replacement for `useLoadUserQuery` that returns the demo user
// (and skips the real network request) whenever demo mode is active.
export const useCurrentUser = (arg: any = {}) => {
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(isDemoMode());
  }, []);

  const query = useLoadUserQuery(arg, { skip: demo });

  if (demo) {
    return {
      ...query,
      data: { user: DEMO_USER },
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
    };
  }

  return query;
};
