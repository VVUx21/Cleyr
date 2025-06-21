'use client';
import { useUser } from "@clerk/nextjs"
import { useUserContext } from "./userstate";
import React, { useState, useEffect } from "react";
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const UserContext = useUserContext();
    // Initialize quizAttempts from localStorage or default to 0
    // This will only run on the client side
  const [User, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return user ?? null;
    }
    return null;
  }
  );
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(user ?? null);
    }
  }, [user]);

  const [quizAttempts, setQuizAttempts] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quizAttempts");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quizAttempts", quizAttempts.toString());
    }
  }, [quizAttempts]);

  const incrementQuizAttempts = () => {
    setQuizAttempts((prev) => prev + 1);
  };

  return (
    <UserContext.Provider value={{ quizAttempts, incrementQuizAttempts, User }}>
      {children}
    </UserContext.Provider>
  );
};
