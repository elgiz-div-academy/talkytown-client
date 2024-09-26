import type { RootState } from "@/lib/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

console.log(" process.env.PUBLIC_API_URL", process.env.PUBLIC_API_URL);
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3002",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
  },
});
