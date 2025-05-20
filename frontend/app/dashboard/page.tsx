"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSkinCare } from "@/context/skin-care-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, Droplets, Sun } from "lucide-react"
import Image from "next/image"
import ProductCard from "@/components/product-card"
import RoutineStepCard from "@/components/routine-step-card"
import ReminderCard from "@/components/reminder-card"
import ProgressTracker from "@/components/progress-tracker"

export default function DashboardPage() {
  const { userProfile, getRecommendedProducts, getRoutine } = useSkinCare()
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding if not completed
    if (!userProfile.completedOnboarding) {
      router.push("/onboarding")
    }
  }, [userProfile.completedOnboarding, router])

  const products = getRecommendedProducts()
  const { morning, evening } = getRoutine()

  if (!userProfile.completedOnboarding) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-emerald-600">Cleanify</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/onboarding")} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Personalized Skincare Routine</h1>
            <p className="text-muted-foreground">
              Based on your {userProfile.skinType} skin type and focus on {userProfile.skinConcern}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="morning" className="mb-8">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="morning" className="flex items-center gap-1">
                      <Sun className="h-4 w-4" />
                      Morning Routine
                    </TabsTrigger>
                    <TabsTrigger value="evening" className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      Evening Routine
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="morning" className="mt-4 space-y-4">
                  {morning.length > 0 ? (
                    morning.map((step, index) => (
                      <RoutineStepCard
                        key={step.id}
                        step={step}
                        stepNumber={index + 1}
                        product={products.find((p) => p.id === step.productId)}
                      />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p>No morning routine steps available for your profile.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="evening" className="mt-4 space-y-4">
                  {evening.length > 0 ? (
                    evening.map((step, index) => (
                      <RoutineStepCard
                        key={step.id}
                        step={step}
                        stepNumber={index + 1}
                        product={products.find((p) => p.id === step.productId)}
                      />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p>No evening routine steps available for your profile.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Recommended Products</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {userProfile.faceScanImage && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Face Scan</CardTitle>
                    <CardDescription>Uploaded during your skincare assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={userProfile.faceScanImage || "/placeholder.svg"}
                      alt="Your face scan"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daily Reminders</CardTitle>
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Important tips for your skincare routine</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ReminderCard
                    title="Stay Hydrated"
                    description="Drink at least 8 glasses of water daily"
                    icon="droplets"
                  />
                  <ReminderCard title="Apply SPF" description="Use sunscreen daily, even when indoors" icon="sun" />
                  <ReminderCard
                    title="Clean Your Pillowcase"
                    description="Change pillowcases 1-2 times per week"
                    icon="bed"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracker</CardTitle>
                  <CardDescription>Track your skincare journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressTracker />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
