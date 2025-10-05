
"use client"
import { useCallback } from "react"
import { MapPin, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { WishlistButton } from "@/components/common/wishlist-button" // New import
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext" // New import

export interface ExploreCardProps {
  id: string
  name: string
  category: string
  image: string
  rating: number
  reviewCount?: number
  distance: string
  description: string
  badge?: "trending" | "sponsored" | "popular" | null
  className?: string
  isResponsive?: boolean
  // Add coordinates for directions
  coordinates?: {
    lat: number
    lng: number
  }
}

const getBadgeStyles = (badge: NonNullable<ExploreCardProps["badge"]>) => {
  switch (badge) {
    case "sponsored":
      return "bg-yellow-400 text-black"
    case "popular":
      return "bg-green-100 text-green-700"
    case "trending":
      return "text-white"
    default:
      return "bg-grey-200 text-grey-700"
  }
}

export function ExploreCard({
  id,
  name,
  category,
  image,
  rating,
  reviewCount,
  distance,
  description,
  badge = null,
  className,
  isResponsive = false,
  coordinates,
}: ExploreCardProps) {
  const t = useTranslations()
  const router = useRouter()

  // Create wishlist item
  const wishlistItem: WishlistItem = { type: 'explore', props: { id, name, category, image, rating, reviewCount, distance, description, badge, className, isResponsive, coordinates } }

  const handleGetDirections = useCallback(() => {
    if (coordinates) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`
      window.open(mapsUrl, '_blank')
    } else {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}`
      window.open(mapsUrl, '_blank')
    }
  }, [coordinates, name])
  
  const handleMoreInfo = useCallback(() => {
    router.push(`/explore/${id}`)
  }, [id, router])

  return (
    <div
      className={cn(
        "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        isResponsive ? "w-full h-auto" : "w-[320px] h-[360px]",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-[150px] overflow-hidden bg-grey-5">
        <img
          src={image || "/placeholder.svg?height=150&width=320"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge (Top Left) */}
        {badge && (
          <div
            className={cn(
              "absolute top-3 left-3 h-[26px] px-3 rounded-full text-xs font-semibold flex items-center shadow-sm",
              badge === "trending" ? "text-white" : getBadgeStyles(badge),
            )}
            style={badge === "trending" ? { backgroundColor: "#D08700" } : {}}
          >
            {badge === "trending"
              ? t("explore.badges.trending")
              : badge === "sponsored"
                ? t("explore.badges.sponsored")
                : badge === "popular"
                  ? t("explore.badges.popular")
                  : null}
          </div>
        )}

        {/* Wishlist Button */}
        <WishlistButton item={wishlistItem} className="top-3 right-3" />
      </div>

      {/* Content */}
      <div className="p-4 h-[210px] flex flex-col justify-between">
        {/* Category */}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap w-fit">
          {category}
        </span>

        {/* Title + Description */}
        <div className="space-y-1 pt-2 pb-1">
          <h3 className="text-normal-semibold text-black-1 line-clamp-1">{name}</h3>
          <p className="text-small-regular text-grey-2 line-clamp-2">{description}</p>
        </div>

        {/* Rating + Distance */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-small-semibold text-black-1">{rating}</span>
            {reviewCount !== undefined && <span className="text-small-regular text-grey-2">({reviewCount})</span>}
          </div>
          <div className="flex items-center gap-2 text-grey-2">
            <MapPin className="w-3 h-3 text-grey-3" />
            <span className="text-smaller-regular">{distance}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleGetDirections}
            className="flex-1 !text-white text-small-regular"
          >
            <Navigation className="w-3 h-3 mr-1" />
            {t("explore.actions.directions")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoreInfo}
            className="flex-1 text-small-regular bg-transparent"
          >
            {t("explore.actions.moreInfo")}
          </Button>
        </div>
      </div>
    </div>
  )
}