"use client"
import { useEffect, useState } from "react"
import { Clock, Star, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { WishlistButton } from "@/components/common/wishlist-button"
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext"
import OfferPopup from "@/components/common/offer-popup/offer-popup" 
import { createPortal } from "react-dom"

export interface FlashCardProps { id: string
   title: string
    subtitle: string 
    image: string 
    location: string 
    rating: number 
    reviewCount?: number 
    originalPrice: string 
    discountedPrice: string 
    discountPercentage: number 
    expiryDate: string | Date 
    timerMinutes?: number 
    timerSeconds?: number 
    className?: string 
    isResponsive?: boolean }
export function FlashCard({
  id,
  title,
  subtitle,
  image,
  location,
  rating,
  reviewCount,
  originalPrice,
  discountedPrice,
  discountPercentage,
  expiryDate,
  timerMinutes = 0,
  timerSeconds = 0,
  className,
  isResponsive = false,
}: FlashCardProps) {
  const [timeLeft, setTimeLeft] = useState({ minutes: timerMinutes, seconds: timerSeconds })
  const [showPopup, setShowPopup] = useState(false) // ✅ popup state

  // Wishlist item
  const wishlistItem: WishlistItem = {
    type: "flash",
    props: {
      id,
      title,
      subtitle,
      image,
      location,
      rating,
      reviewCount,
      originalPrice,
      discountedPrice,
      discountPercentage,
      expiryDate,
      timerMinutes,
      timerSeconds,
      className,
      isResponsive,
    },
  }

  // Timer
  useEffect(() => {
    const targetTime = new Date(expiryDate).getTime()
    let timer: NodeJS.Timeout

    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = Math.max(0, targetTime - now)

      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ minutes: mins, seconds: secs })
      if (diff <= 0) clearInterval(timer)
    }

    updateTimer()
    timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [expiryDate])

  const isExpired = timeLeft.minutes === 0 && timeLeft.seconds === 0
  const formatTime = (time: number) => time.toString().padStart(2, "0")

  return (
    <>
      <div
        className={cn(
          "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
          isResponsive ? "w-full h-auto" : "w-[320px] h-[320px]",
          className,
        )}
      >
        {/* Image Section */}
        <div className="relative h-[145px] overflow-hidden bg-grey-5">
          <img
            src={image || "/placeholder.svg?height=145&width=320&query=restaurant food"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-[100px] text-smaller-semibold h-[25px] flex items-center">
            {discountPercentage}% OFF
          </div>

          {/* Timer Badge */}
          <div className="absolute bottom-4 left-4 bg-warning text-black-2 px-2 py-1 rounded-[100px] flex items-center gap-1 h-[25px]">
            <Clock className="w-3 h-3" />
            <span className="text-smaller-semibold">
              {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 h-32px bg-white/95 backdrop-blur-sm px-2 py-1 rounded-[100px] flex items-center gap-1">
            <Star className="w-5 h-5 fill-warning text-warning" />
            <span className="text-normal-semibold text-black-1">{rating}</span>
          </div>

          {/* Wishlist Button */}
          <WishlistButton item={wishlistItem} />
        </div>

        {/* Content Section */}
        <div className="p-4 h-[175px] flex flex-col justify-between">
          {/* Category and Location Row */}
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 rounded-[100px] text-smaller-semibold bg-primary/10 text-primary h-[25px] flex items-center">
              Restaurants
            </span>
            <div className="flex items-center gap-1 text-grey-2">
              <MapPin className="w-3 h-3" />
              <span className="text-smaller-regular">{location}</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 pt-2 pb-1">
            <h3 className="text-normal-semibold text-black-1 line-clamp-1 leading-tight">{title}</h3>
            <p className="text-small-regular text-grey-2 line-clamp-1 leading-relaxed">{subtitle}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className="text-medium-semibold text-black-1 text-primary">{discountedPrice}</span>
            <span className="text-smaller-regular text-grey-3 line-through">{originalPrice}</span>
          </div>

          {/* Claim Deal Button */}
          <Button
            variant="tertiary"
            size="lg"
            onClick={() => setShowPopup(true)}
            disabled={isExpired}
            className={cn("w-full text-normal-semibold", isExpired && "opacity-50 cursor-not-allowed")}
          >
            {isExpired ? "Deal Expired" : "Claim Flash Deal"}
          </Button>
        </div>
      </div>

      {/* ✅ Render popup outside the card via portal */}
      {showPopup &&
        createPortal(
          <OfferPopup open={showPopup} onClose={() => setShowPopup(false)} />,
          document.body
        )}
    </>
  )
}
