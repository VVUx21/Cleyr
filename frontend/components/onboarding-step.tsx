import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingStepProps {
  title: string
  description: string
  children: React.ReactNode
  currentStep: number
  totalSteps: number
}

export default function OnboardingStep({ title, description, children, currentStep, totalSteps }: OnboardingStepProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
