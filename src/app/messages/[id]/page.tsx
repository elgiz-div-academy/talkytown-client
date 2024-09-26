"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

export default function Messages() {
  const params = useParams();
  const chatId = params?.id;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "2 min ago",
    },
    {
      id: 2,
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "1 min ago",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // In a real application, you would fetch messages for the specific chat here
    console.log(`Fetching messages for chat ID: ${chatId}`);
  }, [chatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage.trim(),
        timestamp: "Just now",
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=Alice Johnson`}
                alt="Alice Johnson"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <CardTitle>Alice Johnson</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="h-[400px] overflow-y-auto mb-4 space-y-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    message.sender === "You"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {message.timestamp}
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
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
