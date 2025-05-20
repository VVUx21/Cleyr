"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive"
export type SkinConcern = "acne" | "aging" | "dullness" | "hyperpigmentation" | "redness"
export type RoutineType = "minimal" | "standard" | "comprehensive"

export interface UserProfile {
  skinType?: SkinType
  skinConcern?: SkinConcern
  routineType?: RoutineType
  additionalInfo?: string
  faceScanImage?: string
  currentStep: number
  completedOnboarding: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  price: string
  category: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "mask" | "exfoliator"
  forSkinTypes: SkinType[]
  forSkinConcerns: SkinConcern[]
  amazonUrl?: string
  available: boolean
}

export interface RoutineStep {
  id: string
  name: string
  description: string
  timeOfDay: "AM" | "PM" | "both"
  productId: string
}

interface SkinCareContextType {
  userProfile: UserProfile
  updateUserProfile: (updates: Partial<UserProfile>) => void
  resetUserProfile: () => void
  getRecommendedProducts: () => Product[]
  getRoutine: () => { morning: RoutineStep[]; evening: RoutineStep[] }
}

const defaultUserProfile: UserProfile = {
  currentStep: 0,
  completedOnboarding: false,
}

const SkinCareContext = createContext<SkinCareContextType | undefined>(undefined)

export function SkinCareProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)

  // Sample product data
  const products: Product[] = [
    {
      id: "p1",
      name: "Gentle Foaming Cleanser",
      description: "A gentle cleanser that removes impurities without stripping the skin.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$18.99",
      category: "cleanser",
      forSkinTypes: ["dry", "sensitive", "normal", "combination"],
      forSkinConcerns: ["acne", "dullness", "redness"],
      amazonUrl: "https://amazon.com",
      available: true,
    },
    {
      id: "p2",
      name: "Hydrating Toner",
      description: "Alcohol-free toner that balances pH and adds hydration.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$22.99",
      category: "toner",
      forSkinTypes: ["dry", "normal", "sensitive"],
      forSkinConcerns: ["dullness", "redness"],
      amazonUrl: "https://amazon.com",
      available: true,
    },
    {
      id: "p3",
      name: "Vitamin C Serum",
      description: "Brightening serum with 15% vitamin C to fade dark spots.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$34.99",
      category: "serum",
      forSkinTypes: ["all", "normal", "combination", "oily"],
      forSkinConcerns: ["hyperpigmentation", "dullness", "aging"],
      amazonUrl: "https://amazon.com",
      available: true,
    },
    {
      id: "p4",
      name: "Oil-Free Moisturizer",
      description: "Lightweight, oil-free moisturizer for balanced hydration.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$24.99",
      category: "moisturizer",
      forSkinTypes: ["oily", "combination", "normal"],
      forSkinConcerns: ["acne", "dullness"],
      amazonUrl: "https://amazon.com",
      available: false,
    },
    {
      id: "p5",
      name: "SPF 50 Sunscreen",
      description: "Broad-spectrum protection with antioxidants.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$28.99",
      category: "sunscreen",
      forSkinTypes: ["all", "dry", "normal", "combination", "oily", "sensitive"],
      forSkinConcerns: ["aging", "hyperpigmentation"],
      amazonUrl: "https://amazon.com",
      available: true,
    },
    {
      id: "p6",
      name: "Retinol Night Cream",
      description: "Anti-aging night cream with retinol to reduce fine lines.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "$38.99",
      category: "moisturizer",
      forSkinTypes: ["normal", "dry", "combination"],
      forSkinConcerns: ["aging", "dullness"],
      amazonUrl: "https://amazon.com",
      available: true,
    },
  ]

  // Sample routine steps
  const routineSteps: RoutineStep[] = [
    {
      id: "s1",
      name: "Cleanse",
      description: "Wash your face with a gentle cleanser",
      timeOfDay: "both",
      productId: "p1",
    },
    {
      id: "s2",
      name: "Tone",
      description: "Apply toner with a cotton pad",
      timeOfDay: "both",
      productId: "p2",
    },
    {
      id: "s3",
      name: "Apply Vitamin C",
      description: "Apply vitamin C serum to brighten skin",
      timeOfDay: "AM",
      productId: "p3",
    },
    {
      id: "s4",
      name: "Moisturize",
      description: "Apply moisturizer to hydrate skin",
      timeOfDay: "both",
      productId: "p4",
    },
    {
      id: "s5",
      name: "Apply Sunscreen",
      description: "Apply sunscreen for UV protection",
      timeOfDay: "AM",
      productId: "p5",
    },
    {
      id: "s6",
      name: "Apply Retinol",
      description: "Apply retinol cream for anti-aging benefits",
      timeOfDay: "PM",
      productId: "p6",
    },
  ]

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }))
  }

  const resetUserProfile = () => {
    setUserProfile(defaultUserProfile)
  }

  const getRecommendedProducts = (): Product[] => {
    if (!userProfile.skinType || !userProfile.skinConcern) {
      return []
    }

    // Filter products based on user's skin type and concerns
    return products.filter(
      (product) =>
        (product.forSkinTypes.includes(userProfile.skinType as SkinType) || product.forSkinTypes.includes("all")) &&
        product.forSkinConcerns.includes(userProfile.skinConcern as SkinConcern),
    )
  }

  const getRoutine = () => {
    const recommendedProducts = getRecommendedProducts()
    const productIds = recommendedProducts.map((p) => p.id)

    // Filter routine steps based on recommended products
    const filteredSteps = routineSteps.filter((step) => productIds.includes(step.productId))

    // Separate morning and evening routines
    const morning = filteredSteps.filter((step) => step.timeOfDay === "AM" || step.timeOfDay === "both")
    const evening = filteredSteps.filter((step) => step.timeOfDay === "PM" || step.timeOfDay === "both")

    return { morning, evening }
  }

  return (
    <SkinCareContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        resetUserProfile,
        getRecommendedProducts,
        getRoutine,
      }}
    >
      {children}
    </SkinCareContext.Provider>
  )
}

export function useSkinCare() {
  const context = useContext(SkinCareContext)
  if (context === undefined) {
    throw new Error("useSkinCare must be used within a SkinCareProvider")
  }
  return context
}
