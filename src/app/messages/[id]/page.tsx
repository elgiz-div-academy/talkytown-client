"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useFindOrCreateChatMutation,
  useMessageListQuery,
  useSendMessageMutation,
} from "@/lib/features/chat/chat.api";
import { useAppSelector } from "@/lib/hooks";
import LoadingSpinner from "@/components/ui/loading";
import { Spinner } from "@/components/ui/spinner";
import { SendIcon } from "lucide-react";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export default function Messages() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdQuery = !!searchParams.get("userId");
  const chatId = params?.id;
  const { data, ...messageFlags } = useMessageListQuery(chatId as string, {
    skip: !!userIdQuery,
  });

  const [findOrCreateChat] = useFindOrCreateChatMutation();

  const [chat, setChat] = useState(data?.chat || null);
  const [messages, setMessages] = useState(data?.messages || []);
  const mounted = useRef(false);

  useEffect(() => {
    setChat(data?.chat);
    setMessages(data?.messages);
  }, [data]);

  useEffect(() => {
    if (!mounted.current) {
      if (userIdQuery) {
        findOrCreateChat(+params?.id)
          .unwrap()
          .then((result) => {
            if (result?.chat) {
              router.replace(`/messages/${result.chat.id}`);
            } else {
              alert("Some problem happened");
            }
          });

        return () => {
          mounted.current = true;
        };
      }
    }
  }, []);

  const [sendMessage, sendMessageFlags] = useSendMessageMutation();

  const myUser = useAppSelector((state) => state.auth.user);

  const scrollElementRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (scrollElementRef.current) {
      (scrollElementRef.current as any).scrollTop = (
        scrollElementRef.current as any
      ).scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      let result = await sendMessage({
        chatId: +chatId,
        message: newMessage,
      }).unwrap();
      if (result.status === true) {
        setMessages([...messages, result.message]);
      }
    }
  };
  if (messageFlags.isLoading || !chat) return <LoadingSpinner />;

  const isGroup = chat.isGroup;
  const user =
    !isGroup &&
    chat.participants.find((p: any) => p.user.id != myUser.id)?.user;

  let sortedMessages = messages.toSorted(
    (a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={
                  isGroup ? chat.name?.slice(0, 2) : user.userName.slice(0, 2)
                }
                alt={isGroup ? chat.name : user.userName}
              />
              <AvatarFallback>
                {user.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{isGroup ? chat.name : user.userName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={scrollElementRef}
            className="h-[400px] overflow-y-auto mb-4 space-y-4"
            aria-live="polite"
          >
            {sortedMessages?.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender?.id === myUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    message.sender?.id === myUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p>{message.message}</p>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {message.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              aria-label="Type a message"
              className="flex-grow"
            />
            <Button type="submit">
              {sendMessageFlags.isLoading ? <Spinner /> : <SendIcon />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
