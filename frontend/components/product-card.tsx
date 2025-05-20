import type { Product } from "@/context/skin-care-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="font-medium">{product.price}</span>
          <span className="text-xs text-muted-foreground">{product.category}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {product.available ? (
          <Button className="w-full" asChild>
            <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
              View on Amazon
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Currently Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
