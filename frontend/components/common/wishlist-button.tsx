// components/WishlistButton.tsx
"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext"

interface WishlistButtonProps {
  item: WishlistItem
  className?: string
  iconClass?: string
}

export function WishlistButton({ item, className, iconClass }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const isWishlisted = isInWishlist(item.props.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(item.props.id)
    } else {
      addToWishlist(item)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
        isWishlisted
          ? "bg-white/20 text-primary border-2 border-white"
          : "bg-white/90 text-grey-2 hover:bg-white hover:text-primary border-2 border-transparent hover:border-primary/20",
        className
      )}
    >
      <Heart className={cn("w-3 h-3", isWishlisted && "fill-current", iconClass)} />
    </button>
  )
}