// Updated MarketplaceProductCard component
"use client"
import type React from "react"
import { MessageCircle, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { WishlistButton } from "@/components/common/wishlist-button" // New import
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext" // New import


export interface MarketplaceProductCardProps {
  id: string
  name: string
  brand: string
  image: string
  rating: number
  reviewCount?: number
  price: number
  originalPrice?: number
  discount?: number
  description: string
  badge?: "sponsored" | "brand_new" | null
  condition: string
  seller: string
  inStock: boolean
  location?: string
  className?: string
}
const getBadgeText = (badge: NonNullable<MarketplaceProductCardProps["badge"]>, t: any) =>
  badge === "sponsored" ? t("marketplace.badges.sponsored") : t("marketplace.badges.brandNew")

const getBadgeStyles = (badge: NonNullable<MarketplaceProductCardProps["badge"]>) => {
  switch (badge) {
    case "sponsored":
      return "bg-yellow-400 text-black"
    case "brand_new":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-grey-200 text-grey-700"
  }
}

export function MarketplaceProductCard({
  id,
  name,
  brand,
  image,
  rating,
  reviewCount,
  price,
  originalPrice,
  discount,
  description,
  badge = null,
  condition,
  seller,
  inStock,
  location,
  className,
}: MarketplaceProductCardProps) {
  const t = useTranslations()

  // Create wishlist item
  const wishlistItem: WishlistItem = { type: 'marketplace-product', props: { id, name, brand, image, rating, reviewCount, price, originalPrice, discount, description, badge, condition, seller, inStock, location, className } }

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Chat with seller:", seller)
  }

  return (
    <Link
      href={`/marketplace/product/${id}`}
      className={cn(
        "group relative bg-white rounded-[14px] overflow-visible border border-grey-5 transition-all duration-200 hover:shadow-md",
        "w-full max-w-[340px]",
        className,
      )}
    >
      {/* IMAGE AREA */}
      <div className="relative h-[170px] bg-grey-5 overflow-visible rounded-t-[14px]">
        <img
          src={image || "/placeholder.svg?height=200&width=320"}
          alt={name}
          className="w-full h-full object-cover rounded-t-[14px] group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount pill (top-left) */}
        {discount && (
          <div className="absolute top-3 left-3 z-40 rounded-full px-3 py-1 text-[12px] font-semibold bg-primary text-white shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <WishlistButton 
          item={wishlistItem} 
          className="top-3 right-3 w-9 h-9" 
          iconClass="w-4 h-4"
        />

        {/* SPONSORED BADGE — moved higher into image using translate-y-1/4 */}
        {badge && (
          <div
            className={cn(
              "absolute left-4 bottom-0 -translate-y-1/4 inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full shadow-sm z-30",
              getBadgeStyles(badge),
            )}
          >
            {getBadgeText(badge, t)}
          </div>
        )}

        <div
          className="absolute right-4 bottom-0 -translate-y-1/4 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm z-30"
          role="img"
          aria-label={`rating ${rating}`}
        >
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-semibold text-black-1">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-4 pt-6 pb-4">
        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
            {t("marketplace.badges.product")}
          </span>
          <span className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{brand}</span>
        </div>

        {/* Title + Description */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-black-1 line-clamp-1">{name}</h3>
          <p className="text-xs text-grey-2 mt-1 line-clamp-2">{description}</p>
        </div>

        {/* Stock + Price */}
        <div className="mt-3">
          <div className={cn("text-sm font-medium", inStock ? "text-success" : "text-failure")}>
            {inStock ? t("marketplace.inStock") : t("marketplace.outOfStock")}
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <div className="text-2xl font-extrabold text-primary">{price} KD</div>
            {originalPrice && <div className="text-sm text-grey-3 line-through">{originalPrice} KD</div>}
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-3 mt-4 mb-3">
          <div className="w-7 h-7 bg-grey-4 rounded-full flex items-center justify-center">
            <span className="text-xs text-grey-2 font-medium">{seller?.charAt(0) ?? "S"}</span>
          </div>
          <div>
            <div className="text-sm text-grey-2">{seller}</div>
          </div>
        </div>

        {/* Chat button - full-width rounded-full */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleChat}
          className="w-full rounded-full py-3 text-sm bg-transparent border-grey-4 text-grey-1 hover:bg-grey-6 hover:border-grey-3"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t("marketplace.actions.chat")}
        </Button>
      </div>
    </Link>
  )
}