"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/common/badge"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface MarketplaceServiceHeroProps {
  service: {
    id: string
    name: string
    category: string
    subcategory: string
    description: string
    rating: number
    reviewCount: number
    images: string[]
  }
}

export default function MarketplaceServiceHero({ service }: MarketplaceServiceHeroProps) {
  const t = useTranslations()
  const [currentImage, setCurrentImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % service.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + service.images.length) % service.images.length)
  }

  return (
    <>
      {/* Breadcrumb */}
    
      <div className="my-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{service.name}</h1>
        <p className="text-muted-foreground text-sm md:text-base">{service.description}</p>
      </div>

      <section className="relative">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-gray-100">
          {/* Image Carousel */}
          <div className="relative h-full">
            {service.images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${service.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {service.images.length > 1 && (
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
            {service.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {service.images.map((_, index) => (
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
              <div className="flex space-x-2">
                <Badge className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {t("marketplace.badges.service")}
                </Badge>
                <Badge className="bg-primary/80 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {service.category}
                </Badge>
                <Badge className="bg-primary/60 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {service.subcategory}
                </Badge>
              </div>
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
