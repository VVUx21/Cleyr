import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { SkinCareProvider } from "@/context/skin-care-context"
import { ClerkProvider } from "@clerk/nextjs"
import { UserProvide } from '@/context/userdatabase' // ✅ Import your UserProvider;
import { UserProvider } from "@/context/usercontext" // ✅ Import your UserProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cleanify - Personalized Skincare Recommendations",
  description: "Get personalized skincare routines and product recommendations",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <UserProvider> {/* ✅ Wrap in UserProvider */}
            <SkinCareProvider>
              <UserProvide> {/* ✅ Wrap in UserProvide */}
                {/* This is where your application content will be rendered */}
              {children}
              </UserProvide>
            </SkinCareProvider>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
