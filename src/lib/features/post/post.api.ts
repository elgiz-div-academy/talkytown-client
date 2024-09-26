import { baseQuery } from "@/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery,
  tagTypes: ["post"],
  endpoints: (builder) => ({
    // Endpoint to fetch all notes
    getUserPosts: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/post/user/${id}`,
      }),
    }),

    // // Endpoint to create a new note
    // createNote: builder.mutation({
    //   query: ({ title, description }) => ({
    //     method: "POST",
    //     url: "/notes",
    //     body: { title, description },
    //   }),
    // }),

    // // Endpoint to update an existing note by ID
    // updateNote: builder.mutation({
    //   query: ({ id, title, description }) => ({
    //     method: "POST",
    //     url: `/notes/${id}`,
    //     body: { title, description },
    //   }),
    // }),

    // // Endpoint to delete a note by ID
    // deleteNote: builder.mutation({
    //   query: (id) => ({
    //     method: "DELETE",
    //     url: `/notes/${id}`,
    //   }),
    // }),
  }),
});

export const { useGetUserPostsQuery } = postApi;
