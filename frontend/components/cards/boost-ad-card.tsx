"use client"

import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AdItem } from "@/components/my-ads/ads-list"

type Props = {
  ad: AdItem
  href: string
  className?: string
}
export function BoostAdCard({ ad, href, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "block w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow",
        className,
      )}
    >
      <Card
        className="w-full h-full border-0 flex flex-col border border-border"
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image - takes approximately 60% of card height */}
          <div className="w-full h-[168px] sm:h-[192px] overflow-hidden bg-[#D1D3D8] flex items-center justify-center">
            <img
              src="/placeholder.svg?height=240&width=320"
              alt={`${ad.title} image`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Content area - takes remaining 40% */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
            {/* Category badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ad.badges.slice(0, 3).map((b) => (
                <Badge 
                  key={b} 
                  variant="secondary" 
                  className="rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white"
                >
                  {b}
                </Badge>
              ))}
            </div>
            
            {/* Title */}
            <h3 className="text-sm sm:text-base font-bold leading-tight mb-1 line-clamp-1">
              {ad.title}
            </h3>
            
            {/* Subtitle/specs */}
            <p className="text-[11px] sm:text-xs text-gray-600 mb-1.5 line-clamp-1">
              {ad.subtitle}
            </p>
            
            {/* Stock status */}
            <p className="text-[11px] sm:text-xs font-medium text-green-600 mb-2">
              {ad.inStock ? "In Stock" : "Out of Stock"}
            </p>
            
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-primary">
                {ad.price} KD
              </span>
              {ad.crossedPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {ad.crossedPrice} KD
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}