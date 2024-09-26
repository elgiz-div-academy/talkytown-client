"use client";
import { useAppSelector } from "@/lib/hooks";
import { redirect } from "next/navigation";

export default function MyProfile() {
  const user = useAppSelector((state) => state.auth.user);
  return redirect(`/profile/${user.id}`);
}
