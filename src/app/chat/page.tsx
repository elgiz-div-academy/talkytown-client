"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useChatListQuery } from "@/lib/features/chat/chat.api";
import LoadingSpinner from "@/components/ui/loading";
import { getSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/hooks";

export default function ChatList() {
  const { data, ...chatFlags } = useChatListQuery({});
  const myUser = useAppSelector((state) => state.auth.user);

  let [chats, setChats] = useState(data || []);

  const mounted = useRef(false);

  useEffect(() => {
    setChats(data);
  }, [data]);

  let socket = getSocket();

  useEffect(() => {
    socket.on("chat.update", (chat) => {
      setChats((prevChats: any) => {
        console.log("SET CHATS");
        let findChatIndex = prevChats.findIndex((c: any) => c.id == chat.id);
        if (findChatIndex == -1) {
          chat.unreadCount = 1;
          setChats([chat, ...prevChats]);
        } else {
          let findChat = prevChats[findChatIndex];
          let clonedChats: any = JSON.parse(JSON.stringify(prevChats));
          clonedChats[findChatIndex] = {
            ...chat,
            unreadCount: findChat.unreadCount + 1,
          };
          console.log(clonedChats);
          setChats(clonedChats);
        }
      });
    });
    return () => {
      socket.off("chat.update");
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="space-y-4">
        {chatFlags.isLoading && <LoadingSpinner />}
        {chats?.map((chat: any) => {
          let user = chat.participants.find(
            (p: any) => p.user.id != myUser.id
          )?.user;
          const isGroup = chat.isGroup;
          return (
            <Link href={`/messages/${chat.id}`} key={chat.id}>
              <Card className="hover:bg-gray-100 transition duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={isGroup ? null : user?.profilePicture?.url}
                      />
                      <AvatarFallback>
                        {isGroup
                          ? chat.name?.[0]
                          : user.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {isGroup ? chat.name : user.userName}
                      </CardTitle>
                      {chat.lastMessage ? (
                        <p className="text-sm text-gray-500">
                          {isGroup ? (
                            <b>{chat.lastMessage?.sender?.userName}: </b>
                          ) : (
                            ""
                          )}
                          {chat.lastMessage?.message}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="bg-green-500 rounded-full w-8 h-8 flex justify-center items-center">
                      {chat.unreadCount}
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {chat.timestamp}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
