"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HeartIcon,
  MessageCircleIcon,
  SendIcon,
  BookmarkIcon,
} from "lucide-react";

type Comment = {
  id: number;
  author: string;
  content: string;
};

type Post = {
  id: number;
  author: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "John Doe",
      imageUrl: "/placeholder.svg?height=400&width=400",
      caption: "Enjoying a beautiful day!",
      likes: 15,
      comments: [
        { id: 1, author: "Jane Smith", content: "Looks amazing!" },
        { id: 2, author: "Mike Johnson", content: "Wish I was there!" },
      ],
    },
    {
      id: 2,
      author: "Alice Brown",
      imageUrl: "/placeholder.svg?height=400&width=400",
      caption: "My new artwork 🎨",
      likes: 23,
      comments: [
        { id: 3, author: "Bob Wilson", content: "Incredible talent!" },
      ],
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      const newPostObj: Post = {
        id: posts.length + 1,
        author: "Current User",
        imageUrl: "/placeholder.svg?height=400&width=400",
        caption: newPost,
        likes: 0,
        comments: [],
      };
      setPosts([newPostObj, ...posts]);
      setNewPost("");
    }
  };

  const handleAddComment = (postId: number) => {
    const commentContent = newComments[postId];
    if (commentContent && commentContent.trim()) {
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "Current User",
                  content: commentContent.trim(),
                },
              ],
            };
          }
          return post;
        })
      );
      setNewComments({ ...newComments, [postId]: "" });
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="sr-only">Instagram-like Posts</h1>
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold">Create a new post</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPost} className="flex flex-col space-y-2">
            <Input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              aria-label="New post caption"
            />
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-8">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`}
                    alt={post.author}
                  />
                  <AvatarFallback>{post.author[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{post.author}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="w-full h-auto"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(post.id)}
                      aria-label="Like"
                    >
                      <HeartIcon className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Comment">
                      <MessageCircleIcon className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Share">
                      <SendIcon className="h-6 w-6" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Save">
                    <BookmarkIcon className="h-6 w-6" />
                  </Button>
                </div>
                <p className="font-semibold mb-1">{post.likes} likes</p>
                <p>
                  <span className="font-semibold">{post.author}</span>{" "}
                  {post.caption}
                </p>
                <div className="mt-2 space-y-1">
                  {post.comments.map((comment) => (
                    <p key={comment.id}>
                      <span className="font-semibold">{comment.author}</span>{" "}
                      {comment.content}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(post.id);
                }}
                className="w-full flex space-x-2"
              >
                <Input
                  value={newComments[post.id] || ""}
                  onChange={(e) =>
                    setNewComments({
                      ...newComments,
                      [post.id]: e.target.value,
                    })
                  }
                  placeholder="Add a comment..."
                  aria-label={`Add a comment to ${post.author}'s post`}
                  className="flex-grow"
                />
                <Button type="submit" variant="ghost">
                  Post
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
