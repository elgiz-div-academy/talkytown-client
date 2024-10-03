import { baseQuery } from "@/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["user"],
  endpoints: (builder) => ({
    searchUser: builder.mutation({
      query: (searchParam: string) => ({
        method: "GET",
        url: `/user/search?searchParam=${searchParam}`,
      }),
    }),
  }),
});

export const { useSearchUserMutation } = userApi;
