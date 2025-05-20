import type { RoutineStep, Product } from "@/context/skin-care-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface RoutineStepCardProps {
  step: RoutineStep
  stepNumber: number
  product?: Product
}

export default function RoutineStepCard({ step, stepNumber, product }: RoutineStepCardProps) {
  if (!product) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800">
            {stepNumber}
          </div>
          <div>
            <CardTitle className="text-lg">{step.name}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-24 w-24 overflow-hidden rounded-md bg-muted">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.price}</p>
            </div>
            {product.available ? (
              <Button size="sm" variant="outline" className="mt-2 w-full sm:w-auto" asChild>
                <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
                  View Product
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-2 w-full sm:w-auto" disabled>
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
