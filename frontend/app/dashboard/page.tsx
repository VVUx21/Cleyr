"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSkinCare } from "@/context/skin-care-context";
import { useUserContext } from "@/context/userstate";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import DashboardTabs from "../../components/dashboard/dashboard-tabs";
import { Product, EducationalContent } from "@/lib/types";

export default function DashboardPage() {
  const { userProfile } = useSkinCare();
  const router = useRouter();
  const UserContext = useUserContext();
  const Context = React.useContext(UserContext);
  const User = Context?.User;
  const quizAttempts = Context?.quizAttempts ?? 0;
  const incrementQuizAttempts = Context?.incrementQuizAttempts ?? (() => {});

  const [products, setProducts] = useState<Product[]>([]);
  const [educational, setEducational] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleStartQuizClick(e: React.MouseEvent) {
    if (!User) {
      if (quizAttempts > 2) {
        e.preventDefault();
        alert("Please sign in or sign up to continue with the quiz.");
        router.push("/sign-in");
        return;
      }
      incrementQuizAttempts();
      router.push("/onboarding");
    } else {
      router.push("/onboarding");
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (!userProfile.completedOnboarding) {
          router.push("/onboarding");
          return;
      }
        const response = await fetch("/api/dashboard-data");
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        
        const data = await response.json();
        setProducts(data.products || []);
        setEducational(data.educational || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

      fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-emerald-600">Cleanify</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartQuizClick}
            className="text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Personalized Dashboard</h1>
            <p className="text-muted-foreground">
              Based on your {userProfile.skinType} skin type and focus on {userProfile.skinConcern}
            </p>
          </div>

          <DashboardTabs
            products={products}
            educational={educational}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}