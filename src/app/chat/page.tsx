"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ChatList() {
  const chats = [
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "Hey, how are you?",
      timestamp: "2 min ago",
    },
    {
      id: 2,
      name: "Bob Smith",
      lastMessage: "Did you see the game last night?",
      timestamp: "1 hour ago",
    },
    {
      id: 3,
      name: "Charlie Brown",
      lastMessage: "Let's meet up tomorrow",
      timestamp: "3 hours ago",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link href={`/messages/${chat.id}`} key={chat.id}>
            <Card className="hover:bg-gray-100 transition duration-200">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.name}`}
                    />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{chat.name}</CardTitle>
                    <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {chat.timestamp}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
