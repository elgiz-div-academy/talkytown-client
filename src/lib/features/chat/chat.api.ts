import { baseQuery } from "@/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["chat"],
  endpoints: (builder) => ({
    chatList: builder.query({
      query: () => ({
        method: "GET",
        url: "/chat",
      }),
    }),
    findOrCreateChat: builder.mutation({
      query: (userId: number) => ({
        method: "POST",
        url: `/chat/user/${userId}`,
      }),
    }),
    messageList: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `/chat/${id}`,
      }),
    }),
    sendMessage: builder.mutation({
      query: (body: { message: string; chatId?: number; userId?: number }) => ({
        method: "POST",
        url: "/chat",
        body,
      }),
    }),
  }),
});

export const {
  useChatListQuery,
  useMessageListQuery,
  useSendMessageMutation,
  useFindOrCreateChatMutation,
} = chatApi;
