"use client";
import Posts from "./posts/page";
import { useAppSelector } from "@/lib/hooks";
import { redirect } from "next/navigation";

export default function Home() {
  const token = useAppSelector((state) => state.auth.token);
  if (!token) redirect("/login");
  return <Posts />;
}
