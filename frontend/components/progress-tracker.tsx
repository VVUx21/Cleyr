"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

export default function ProgressTracker() {
  // In a real app, this would be stored in the database
  const [progress, setProgress] = useState({
    daysCompleted: 12,
    totalDays: 30,
    streakDays: 5,
  })

  // This is just a UI stub as mentioned in requirements
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">30-Day Challenge</span>
          <span className="text-sm text-muted-foreground">
            {progress.daysCompleted}/{progress.totalDays} days
          </span>
        </div>
        <Progress value={(progress.daysCompleted / progress.totalDays) * 100} className="h-2" />
      </div>

      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Current Streak</h4>
            <p className="text-sm text-muted-foreground">Keep it going!</p>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{progress.streakDays} days</div>
        </div>
      </div>

      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={() => {
          // In a real app, this would update the database
          setProgress((prev) => ({
            ...prev,
            daysCompleted: Math.min(prev.daysCompleted + 1, prev.totalDays),
            streakDays: prev.streakDays + 1,
          }))
        }}
      >
        <Check className="mr-2 h-4 w-4" /> Mark Today Complete
      </Button>
    </div>
  )
}
