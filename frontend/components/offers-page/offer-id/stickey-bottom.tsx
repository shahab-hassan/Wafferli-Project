// components/offer-detail/StickyBottomCTA.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import OfferPopup from "@/components/common/offer-popup/offer-popup"
interface StickyBottomCTAProps {
  offer: {
    id: number
    business: string
    title: string
    salePrice: number
    savings: number
    discount: number
    remaining: number
    category: string
    expiryDate: string
    validHours: string
    images: string[]
  }
}

export default function StickyBottomCTA({ offer }: StickyBottomCTAProps) {
  const [showClaimPopup, setShowClaimPopup] = useState(false)

  return (
    <>
      {/* Sticky Bottom CTA (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 rounded-t-2xl z-50">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {offer.salePrice} KD
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Save {offer.savings} KD ({offer.discount}% off)
            </div>
          </div>
          {offer.remaining <= 20 && (
            <Badge className="bg-red-100 text-red-700 rounded-full px-2 sm:px-3 py-1 text-xs animate-pulse">
              Only {offer.remaining} left!
            </Badge>
          )}
        </div>
        
        <Button
          onClick={() => setShowClaimPopup(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-lg font-semibold"
        >
          Claim This Offer
        </Button>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind sticky CTA */}
      <div className="lg:hidden h-24 sm:h-28" />

      {/* Claim Offer Popup */}
     {showClaimPopup==true && (<OfferPopup
      />
     )}
    </>

  )
}