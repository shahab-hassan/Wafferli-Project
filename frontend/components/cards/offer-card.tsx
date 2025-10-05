// Updated OfferCard component
"use client"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { Star, MapPin } from "lucide-react"
import { WishlistButton } from "@/components/common/wishlist-button" // New import
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext" // New import
import Link from "next/link"

export interface OfferCardProps {
  id: string
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
  badge?: "trending" | "sponsored" | "new_arrival" | "expiring_soon" | null
  className?: string
  isResponsive?: boolean      // New prop for responsiveness
}

const getBadgeStyles = (badge: NonNullable<OfferCardProps["badge"]>) => {
  switch (badge) {
    case "sponsored":
      return "bg-tertiary text-black"
    case "new_arrival":
      return "bg-green-100 text-green-700"
    case "expiring_soon":
      return "bg-red-100 text-red-600"
    default:
      return "bg-grey-200 text-grey-700"
  }
}

export function OfferCard({
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
  badge = null,
  className,
  isResponsive = false,
}: OfferCardProps) {
  // Create wishlist item
  const wishlistItem: WishlistItem = { type: 'offer', props: { id, title, subtitle, image, location, rating, reviewCount, originalPrice, discountedPrice, discountPercentage, expiryDate, badge, className, isResponsive } }

  const handleClaimDeal = () => {
    console.log(`Claiming deal for card ID: ${id}`)
  }

  const expiry = new Date(expiryDate)
  const isExpired = expiry.getTime() < new Date().getTime()

  return (
    <div
      className={cn(
        "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        isResponsive ? "w-full h-auto" : "w-[320px] h-[360px]",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative h-[150px] overflow-hidden bg-grey-5">
        <img
          src={image || "/placeholder.svg?height=145&width=320&query=restaurant food"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-[100px] text-smaller-semibold h-[25px] flex items-center">
          {discountPercentage}% OFF
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-[100px] flex items-center gap-1">
          <Star className="w-5 h-5 fill-warning text-warning" />
          <span className="text-normal-semibold text-black-1">{rating}</span>
        </div>

        {/* Wishlist Button */}
        <WishlistButton item={wishlistItem} />

        {/* Badge (Bottom Left) */}
        {badge && (
          <div
            className={cn(
              "absolute bottom-3 left-3 h-[25px] px-3 rounded-full text-xs font-semibold flex items-center shadow-sm",
              badge === "trending" ? "text-white" : getBadgeStyles(badge),
            )}
            style={badge === "trending" ? { backgroundColor: "#D08700" } : {}}
          >
            {badge === "trending" ? (
              <>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.28 2.67-.2 3.73-.74 1.67-2.23 2.72-4.01 2.72z" />
                </svg>
                Trending
              </>
            ) : badge === "sponsored" ? (
              <>
                <svg className="pt-1 w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10.3178 8.59338L11.3278 14.2774C11.3391 14.3443 11.3298 14.4131 11.3009 14.4746C11.2721 14.536 11.2252 14.5872 11.1665 14.6212C11.1077 14.6553 11.04 14.6706 10.9724 14.6652C10.9047 14.6597 10.8403 14.6338 10.7878 14.5907L8.40117 12.7994C8.28595 12.7133 8.14599 12.6668 8.00217 12.6668C7.85835 12.6668 7.71838 12.7133 7.60317 12.7994L5.2125 14.5901C5.16005 14.633 5.09574 14.6589 5.02816 14.6644C4.96059 14.6699 4.89295 14.6546 4.83428 14.6206C4.7756 14.5867 4.72868 14.5356 4.69978 14.4743C4.67088 14.4129 4.66136 14.3443 4.6725 14.2774L5.68183 8.59338"
                    stroke="#282828"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9.33337C10.2091 9.33337 12 7.54251 12 5.33337C12 3.12424 10.2091 1.33337 8 1.33337C5.79086 1.33337 4 3.12424 4 5.33337C4 7.54251 5.79086 9.33337 8 9.33337Z"
                    stroke="#282828"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sponsored
              </>
            ) : badge === "new_arrival" ? (
              <>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                New Arrival
              </>
            ) : badge === "expiring_soon" ? (
              <>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19.9A8.9 8.9 0 1 1 20.9 12 8.91 8.91 0 0 1 12 20.9ZM12.5 7h-1v6l5.2 3.1.5-.8-4.7-2.8Z" />
                </svg>
                Expiring Soon
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 h-[210px] flex flex-col justify-between">
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
          <h3 className="text-normal-semibold text-black-1 line-clamp-1 leading-tight">
            {title}
          </h3>
          <p className="text-small-regular text-grey-2 line-clamp-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="text-medium-semibold text-primary">{discountedPrice}</span>
          <span className="text-smaller-regular text-grey-3 line-through">
            {originalPrice}
          </span>
        </div>

        {/* Expiry Date Row */}
        <div className="flex items-center gap-2 text-grey-2 text-small-regular pt-2">
          <Calendar className="w-3 h-3" />
          <span>
            Expires:{" "}
            {expiry.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>


        <Link href={`/offers/${id}`}>

        {/* Claim Deal Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleClaimDeal}
          disabled={isExpired}
          className={cn(
            "w-full !text-white text-normal-regular mt-2",
            isExpired && "opacity-50 cursor-not-allowed",
          )}
        >
          {isExpired ? "Offer Expired" : "View Offer"}
        </Button>
        </Link>
      </div>
    </div>
  )
}