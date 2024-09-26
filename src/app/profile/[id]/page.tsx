"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GridIcon,
  ListIcon,
  Settings,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetProfileQuery } from "@/lib/features/profile/profile.api";
import LoadingSpinner from "@/components/ui/loading";
import { useGetUserPostsQuery } from "@/lib/features/post/post.api";

type Post = {
  id: number;
  imageUrl: string;
  likes: number;
  comments: number;
};

export default function Profile({ params }: { params: { id: string } }) {
  const myUser = useAppSelector((state) => state.auth.user);
  const { data: user, isLoading } = useGetProfileQuery(params.id);

  const { data: posts, ...postFlags } = useGetUserPostsQuery(user?.id, {
    skip: !user?.id,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const editedUser = user;

  // useEffect(() => {
  //   setEditedUser(editedUser);
  // }, [user, isLoading]);

  console.log("user", user, editedUser);
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setUser(editedUser);
    setIsEditDialogOpen(false);
  };

  if (isLoading || !user || !editedUser)
    return <LoadingSpinner text="Loading profile..." />;
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.profilePicture?.url} alt={user.userName} />
              <AvatarFallback>{user.userName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <CardTitle className="text-2xl mb-2">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-muted-foreground mb-2">@{user.userName}</p>
              <p className="mb-4">{user.bio}</p>
              <div className="flex justify-center md:justify-start space-x-4 mb-4">
                <span>
                  <strong>{posts?.length || 0}</strong> posts
                </span>
                <span>
                  <strong>{user.followerCount}</strong> followers
                </span>
                <span>
                  <strong>{user.followedCount}</strong> following
                </span>
              </div>
              {myUser.id === user.id ? (
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          // onChange={(e) =>
                          //   setEditedUser({
                          //     ...editedUser,
                          //     name: e.target.value,
                          //   })
                          // }
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editedUser.username}
                          // onChange={(e) =>
                          //   setEditedUser({
                          //     ...editedUser,
                          //     username: e.target.value,
                          //   })
                          // }
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editedUser.bio}
                          // onChange={(e) =>
                          //   setEditedUser({
                          //     ...editedUser,
                          //     bio: e.target.value,
                          //   })
                          // }
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : user.followStatus === "following" ? (
                <Button variant={"secondary"}>UnFollow</Button>
              ) : (
                <Button variant={"secondary"}>Follow</Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full grid grid-cols-3 gap-4">
            {postFlags.isLoading ? (
              <LoadingSpinner />
            ) : (
              posts.map((post: any) => (
                <div key={post.id} className="relative group">
                  <div className="relative">
                    <div className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide">
                      {post.images.map((image: any, index: any) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Post ${post.id} image ${index + 1}`}
                          className="w-full h-auto flex-shrink-0 snap-center"
                        />
                      ))}
                    </div>
                    {post.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full"
                          onClick={() => {
                            const scrollContainer = document.getElementById(
                              `post-${post.id}-images`
                            );
                            if (scrollContainer) {
                              scrollContainer.scrollBy({
                                left: -scrollContainer.clientWidth,
                                behavior: "smooth",
                              });
                            }
                          }}
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full"
                          onClick={() => {
                            const scrollContainer = document.getElementById(
                              `post-${post.id}-images`
                            );
                            if (scrollContainer) {
                              scrollContainer.scrollBy({
                                left: scrollContainer.clientWidth,
                                behavior: "smooth",
                              });
                            }
                          }}
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <p>{post.likes} likes</p>
                      <p>{post.comments} comments</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
