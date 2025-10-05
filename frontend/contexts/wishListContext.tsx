// contexts/WishlistContext.tsx
"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define prop interfaces (copied from user code for completeness)
export interface FlashCardProps {
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
  timerMinutes?: number
  timerSeconds?: number
  className?: string
  isResponsive?: boolean
}

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
  isResponsive?: boolean
}

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

export interface EvenCardProps {
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
  coordinates?: {
    lat: number
    lng: number
  }
}

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
  coordinates?: {
    lat: number
    lng: number
  }
}

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

export interface MarketplaceServiceCardProps {
  id: string
  name: string
  category: string
  subcategory: string
  image: string
  rating: number
  reviewCount?: number
  startingPrice: number
  description: string
  badge?: "sponsored" | null
  seller: string
  location?: string
  className?: string
}

// Union type for wishlist items
type WishlistItem = 
  | { type: 'flash'; props: FlashCardProps }
  | { type: 'offer'; props: OfferCardProps }
  | { type: 'product'; props: ProductCardProps }
  | { type: 'event'; props: EvenCardProps } 
  | { type: 'explore'; props: ExploreCardProps } 
  | { type: 'marketplace-product'; props: MarketplaceProductCardProps }
  | { type: 'marketplace-service'; props: MarketplaceServiceCardProps }

interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
})

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert expiryDate back to Date if necessary
        return parsed.map((item: WishlistItem) => {
          if ('expiryDate' in item.props && typeof item.props.expiryDate === 'string') {
            item.props.expiryDate = new Date(item.props.expiryDate)
          }
          return item
        })
      }
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Convert Date to ISO string for storage
      const storable = wishlist.map((item) => {
        const cloned = { ...item }
        if ('expiryDate' in cloned.props && cloned.props.expiryDate instanceof Date) {
          cloned.props.expiryDate = cloned.props.expiryDate.toISOString()
        }
        return cloned
      })
      localStorage.setItem('wishlist', JSON.stringify(storable))
    }
  }, [wishlist])

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (!prev.some((i) => i.props.id === item.props.id)) {
        return [...prev, item]
      }
      return prev
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((i) => i.props.id !== id))
  }

  const isInWishlist = (id: string) => wishlist.some((i) => i.props.id === id)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
export type { WishlistItem }