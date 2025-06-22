"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { SignInButton, SignUpButton, UserButton} from "@clerk/nextjs"
import { useUserContext } from "@/context/userstate"
import React from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const UserContext= useUserContext();
    const router = useRouter();
    const Context = React.useContext(UserContext);
    const User = Context?.User;
    const quizAttempts = Context?.quizAttempts ?? 0;
    const incrementQuizAttempts = Context?.incrementQuizAttempts ?? (() => {});
  function handleStartQuizClick(e: React.MouseEvent) {
    //console.log("Quiz attempts:", quizAttempts)
    if (!User) {
      if (quizAttempts > 2) {
        e.preventDefault();
        alert("Please sign in or sign up to continue with the quiz.");
        router.push("/sign-in");
        return;
      }
      incrementQuizAttempts();
      // setQuizAttempts((prev) => prev + 1);
      router.push("/onboarding");
    } else {
      // setQuizAttempts(0);
      router.push("/onboarding");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-emerald-600">Cleanify</span>
          </div>
          {
            User ? (
              <UserButton/>
            ) : <div className="flex items-center gap-4">
            <Link href="/sign-in">
            <SignInButton>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                Sign In
              </Button>
            </SignInButton>
            </Link>
            <SignUpButton mode="modal">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
          }
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              Your personalized <br className="hidden sm:inline" />
              <span className="text-emerald-600">skincare routine</span> awaits
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Get tailored skincare recommendations based on your unique skin profile. Take our quick quiz or upload a
              face scan to get started.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/onboarding">
              <Button onClick={handleStartQuizClick} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
        <section className="container py-8 md:py-12 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Personalized</h3>
              <p className="text-muted-foreground">Recommendations tailored to your unique skin profile and concerns</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Simple</h3>
              <p className="text-muted-foreground">Quick 5-step quiz to understand your skin needs and goals</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Effective</h3>
              <p className="text-muted-foreground">Science-backed recommendations for real results</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">© 2025 Cleanify. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

