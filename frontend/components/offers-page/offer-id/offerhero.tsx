// components/offer-detail/OfferHero.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, Star, Users } from "lucide-react"
import { Badge } from "@/components/common/badge"

interface OfferHeroProps {
  offer: {
    id: number
    business: string
    title: string
    description: string
    discount: number
    rating: number
    reviewCount: number
    totalClaimed: number
    images: string[]
  }
}

export default function OfferHero({ offer }: OfferHeroProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <section className="relative max-w-[1440px] mx-auto w-full">
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-b-3xl">
        {/* Image Carousel */}
        <div className="relative h-full">
          {offer.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image 
                src={image} 
                alt={`${offer.title} - Image ${index + 1}`} 
                fill 
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ))}

{/* Image Navigation Indicators */}
{offer.images.length > 1 && (
  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
    {offer.images.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentImage(index)}
        className={`dot ${index === currentImage ? "active" : ""}`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}

    {/* Add styles inline for reusability */}
    <style jsx>{`
      .dot {
        height: 6px;
        border-radius: 9999px;
        background: rgba(156, 163, 175, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }

      .dot.active {
        background: #762c85; /* your brand color */
        width: 24px;
      }

      @media (min-width: 768px) {
        .dot.active {
          width: 32px;
        }
      }

      .dot:hover {
        background: rgba(118, 44, 133, 0.6);
        transform: scale(1.1);
      }
    `}</style>
  </div>
)}


          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
            {/* Top Actions */}
            <div className="flex justify-between items-start">
              <Badge className="bg-tertiary rounded-full px-3 sm:px-4 py-1 sm:py-2 text-lg sm:text-xl font-bold">
                {offer.discount}% OFF
              </Badge>
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all ${
                    isWishlisted ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <button className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="text-white">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                {offer.title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-3 sm:mb-4 line-clamp-3">
                {offer.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Badge className="bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 w-fit">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">
                    {offer.totalClaimed} people claimed this week
                  </span>
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">{offer.rating}</span>
                  <span className="opacity-75 text-xs sm:text-sm">
                    ({offer.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}