import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xl font-bold text-emerald-600">Cleanify</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-screen-md py-8">{children}</div>
      </main>
    </div>
  )
}
