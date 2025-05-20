import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import { SkinCareProvider } from "@/context/skin-care-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cleanify - Personalized Skincare Recommendations",
  description: "Get personalized skincare routines and product recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SkinCareProvider>{children}</SkinCareProvider>
      </body>
    </html>
  )
}


import './globals.css'