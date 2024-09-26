"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store"; // Adjust this import path as needed
import { AuthActions } from "@/lib/features/auth/auth.slice"; // Adjust this import path as needed
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

interface AuthAwareProps {
  children: React.ReactNode;
}

const AuthAwareComponent: React.FC<AuthAwareProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);

    // Check authentication status from localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser && !user) {
      dispatch(AuthActions.set({ token, user: JSON.parse(storedUser) }));
    }
  }, [dispatch, user]);

  if (!isClient) {
    // Server-side or initial render
    return null; // Or a loading placeholder
  }

  return <>{children}</>;
};

export default AuthAwareComponent;
