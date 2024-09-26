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
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export function HeaderNavComponent() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/chat", icon: MessageCircleIcon, label: "Messages" },
    // { href: '/create', icon: PlusSquareIcon, label: 'Create' },
    // { href: '/explore', icon: CompassIcon, label: 'Explore' },
    // { href: '/activity', icon: HeartIcon, label: 'Activity' },
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SocialApp
        </Link>
        {token && (
          <nav>
            <ul className="flex space-x-2 md:space-x-4">
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
