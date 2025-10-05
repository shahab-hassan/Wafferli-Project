
// Updated ProductCard component
"use client"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { WishlistButton } from "@/components/common/wishlist-button" 
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext" 


export interface ProductCardProps {
  id: string
  title: string
  subtitle: string
  image: string
  category: string
  rating: number
  reviewCount: number
  distance: string
  price?: string
  isFree?: boolean
  badge?: "trending" | "sponsored" | null
  className?: string
}

const categoryColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-info/20 text-info",
  "bg-success/20 text-success ",
  "bg-failure/20 text-failure",
  "bg-warning/20 text-warning",
]

const getBadgeStyles = (badge: "trending" | "sponsored" | null) => {
  switch (badge) {
    case "trending":
      return "text-white"
    case "sponsored":
      return "bg-tertiary text-grey-1"
    default:
      return ""
  }
}

const getRandomCategoryColor = (category: string) => {
  const hash = category.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a
  }, 0)

  const colorIndex = Math.abs(hash) % categoryColors.length
  const selectedColor = categoryColors[colorIndex]

  const [bgClass, textClass] = selectedColor.split(" ")

  return {
    bgClass,     
    textClass,
  }
}

export function ProductCard({
  id,
  title,
  subtitle,
  image,
  category,
  rating,
  reviewCount,
  distance,
  price,
  isFree = false,
  badge = null,
  className,
}: ProductCardProps) {
  // Create wishlist item
  const wishlistItem: WishlistItem = { type: 'product', props: { id, title, subtitle, image, category, rating, reviewCount, distance, price, isFree, badge, className } }

  const categoryColor = getRandomCategoryColor(category)

  return (
    <div
      className={cn(
        "group relative w-[260px] h-[280px] bg-white rounded-[12px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative h-[145px] overflow-hidden bg-grey-5">
        <img
          src={image || "/placeholder.svg?height=145&width=320&query=scenic landscape"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "absolute top-3 left-3 h-[25px] px-3 rounded-full text-xs font-semibold flex items-center shadow-sm",
              badge === "trending" ? "text-white" : getBadgeStyles(badge),
            )}
            style={badge === "trending" ? { backgroundColor: "#D08700" } : {}}
          >
            {badge === "trending" ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.28 2.67-.2 3.73-.74 1.67-2.23 2.72-4.01 2.72z" />
                </svg>
                Trending
              </>
            ) : (
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
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <WishlistButton 
          item={wishlistItem} 
          className="top-3 right-3 w-10 h-10" 
          iconClass="w-4 h-4"
        />
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2.5">
        {/* Category */}
        <div className="flex">
          <span
            className={cn(
              "inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold",
              categoryColor.bgClass,
              categoryColor.textClass,
            )}
          >
            {category}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-0.5">
          <h3 className="text-small-semibold text-black-1 line-clamp-1 leading-tight">{title}</h3>
          <p className="text-xs text-grey-2 line-clamp-2 leading-relaxed font-normal">{subtitle}</p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-sm font-bold text-black-1">{rating}</span>
            <span className="text-xs text-grey-2 font-normal">({reviewCount})</span>
          </div>

          {/* Distance & Price */}
          <div className="flex items-center gap-1.5">
            {isFree ? (
              <span className="bg-success/10 text-success px-2.5 py-1 rounded-[100px] text-xs font-bold">FREE</span>
            ) : (
              price && <span className="text-sm font-bold text-black-1">{price}</span>
            )}
            <span className="text-xs text-grey-2 font-normal">{distance}</span>
          </div>
        </div>
      </div>
    </div>
  )
}