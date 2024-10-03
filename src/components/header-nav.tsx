"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HomeIcon,
  MessageCircleIcon,
  PlusSquareIcon,
  CompassIcon,
  HeartIcon,
  SearchIcon,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useSearchUserMutation } from "@/lib/features/user/user.api";
import { useEffect, useState } from "react";
import LoadingSpinner from "./ui/loading";
import { Spinner } from "./ui/spinner";

export function HeaderNavComponent() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();

  const [search, searchFlags] = useSearchUserMutation();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/chat", icon: MessageCircleIcon, label: "Messages" },
    // { href: '/create', icon: PlusSquareIcon, label: 'Create' },
    // { href: '/explore', icon: CompassIcon, label: 'Explore' },
    // { href: '/activity', icon: HeartIcon, label: 'Activity' },
  ];

  const [searchUsers, setSearchUsers] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  const onSearch = async (data: any) => {
    setSearchUsers([]);
    let result = await search(data.searchParam).unwrap();
    if (!result.length) alert("User is not found");
    setSearchUsers(result);
  };

  const onSearchError = (error: any) => {
    setSearchUsers([]);
    alert(error.searchParam.message);
  };

  useEffect(() => {
    reset();
    setSearchUsers([]);
  }, [pathname]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SocialApp
        </Link>
        {token && (
          <nav>
            <ul className="flex space-x-2 md:space-x-4">
              <li>
                <form
                  className="flex gap-2"
                  onSubmit={handleSubmit(onSearch, onSearchError)}
                >
                  <Input
                    {...register("searchParam", {
                      minLength: {
                        value: 3,
                        message: "Please write 3 symbols at least",
                      },
                    })}
                  />
                  <Button type="submit" variant={"ghost"}>
                    {searchFlags.isLoading ? <Spinner /> : <SearchIcon />}
                  </Button>
                </form>
                {!!searchUsers.length && (
                  <div className="relative">
                    <div className="absolute w-48 mt-2 border-gray-100 rounded-sm border-2 bg-gray-50">
                      {searchUsers.map((user: any) => (
                        <Link
                          key={user.id}
                          href={`/profile/${user.id}`}
                          className="cursor-pointer p-2 flex gap-2 items-center border-b-2 border-gray-100 hover:bg-gray-200"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={user.profilePicture?.url}
                              alt={user.userName}
                            />
                            <AvatarFallback>
                              {user.firstName?.[0]?.toUpperCase() +
                                user.lastName?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-full">
                            {user.firstName} {user.lastName}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              {navItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="icon"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                </li>
              ))}
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user.profilePicture?.url ||
                          "https://github.com/shadcn.png"
                        }
                        alt="User"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
