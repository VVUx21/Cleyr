import { Bed, Droplets, Sun } from "lucide-react"

interface ReminderCardProps {
  title: string
  description: string
  icon: "droplets" | "sun" | "bed"
}

export default function ReminderCard({ title, description, icon }: ReminderCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "droplets":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "sun":
        return <Sun className="h-5 w-5 text-amber-500" />
      case "bed":
        return <Bed className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="mt-0.5 rounded-md bg-muted p-1.5">{getIcon()}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
