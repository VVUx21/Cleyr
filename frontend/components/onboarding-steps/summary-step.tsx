"use client"

import { useSkinCare } from "@/context/skin-care-context"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

interface SummaryStepProps {
  onComplete: () => void
}

export default function SummaryStep({ onComplete }: SummaryStepProps) {
  const { userProfile, updateUserProfile } = useSkinCare()

  const getSkinTypeLabel = () => {
    switch (userProfile.skinType) {
      case "dry":
        return "Dry"
      case "oily":
        return "Oily"
      case "combination":
        return "Combination"
      case "normal":
        return "Normal"
      case "sensitive":
        return "Sensitive"
      default:
        return "Not specified"
    }
  }

  const getSkinConcernLabel = () => {
    switch (userProfile.skinConcern) {
      case "acne":
        return "Acne & Breakouts"
      case "aging":
        return "Signs of Aging"
      case "dullness":
        return "Dullness & Uneven Texture"
      case "hyperpigmentation":
        return "Dark Spots & Hyperpigmentation"
      case "redness":
        return "Redness & Sensitivity"
      default:
        return "Not specified"
    }
  }

  const getRoutineTypeLabel = () => {
    switch (userProfile.routineType) {
      case "minimal":
        return "Minimal (3-4 steps)"
      case "standard":
        return "Standard (5-6 steps)"
      case "comprehensive":
        return "Comprehensive (7+ steps)"
      default:
        return "Not specified"
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-medium">Your Skin Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">Skin Type</span>
            <span className="font-medium">{getSkinTypeLabel()}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">Main Concern</span>
            <span className="font-medium">{getSkinConcernLabel()}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">Routine Preference</span>
            <span className="font-medium">{getRoutineTypeLabel()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Face Scan</span>
            <span className="font-medium">{userProfile.faceScanImage ? "Uploaded" : "Not uploaded"}</span>
          </div>
        </div>

        {userProfile.faceScanImage && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground">Your uploaded face scan:</p>
            <Image
              src={userProfile.faceScanImage || "/placeholder.svg"}
              alt="Face scan"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium">You're all set!</p>
            <p className="text-sm">
              Based on your profile, we'll create a personalized skincare routine and product recommendations just for
              you.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => updateUserProfile({ currentStep: Math.max(0, userProfile.currentStep - 1) })}
        >
          Back
        </Button>
        <Button onClick={onComplete} className="bg-emerald-600 hover:bg-emerald-700">
          Get My Routine
        </Button>
      </div>
    </div>
  )
}
