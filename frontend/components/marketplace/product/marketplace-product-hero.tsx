"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/common/badge"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface MarketplaceProductHeroProps {
  product: {
    id: string
    name: string
    brand: string
    description: string
    discount?: number
    rating: number
    reviewCount: number
    images: string[]
    condition: string
    category: string
    subcategory: string
  }
}

export default function MarketplaceProductHero({ product }: MarketplaceProductHeroProps) {
  const t = useTranslations()
  const [currentImage, setCurrentImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="my-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
        <p className="text-muted-foreground text-sm md:text-base">{product.description}</p>
      </div>

      <section className="relative">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-gray-100">
          {/* Image Carousel */}
          <div className="relative h-full">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Image Navigation Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImage ? "bg-primary w-8" : "bg-white/60 w-2 hover:bg-primary/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Top Actions */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              {product.discount && (
                <Badge className="bg-primary text-white rounded-full px-3 py-1 text-sm font-bold">
                  {product.discount}% OFF
                </Badge>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                    isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-700 hover:bg-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
