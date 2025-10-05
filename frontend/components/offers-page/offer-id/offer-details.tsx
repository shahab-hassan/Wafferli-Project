// components/offer-detail/OfferDetails.tsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, Minus, AlertTriangle, Phone } from "lucide-react"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import OfferPopup from "@/components/common/offer-popup/offer-popup"
interface OfferDetailsProps {
  offer: {
    id: number
    business: string
    title: string
    description: string
    originalPrice: number
    salePrice: number
    discount: number
    savings: number
    category: string
    tags: string[]
    expiryDate: string
    validHours: string
    maxQuantity: number
    remaining: number
    images: string[]
  }
}

export default function OfferDetails({ offer }: OfferDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [showClaimPopup, setShowClaimPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 12, minutes: 34, seconds: 56 })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(Math.min(offer.maxQuantity, quantity + 1))
    } else {
      setQuantity(Math.max(1, quantity - 1))
    }
  }

  return (
    <>
      <Card className="bg-transparent  !rounded-md">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 lg:space-y-6">
            {/* Offer Summary */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
                <Badge className="bg-purple-100 text-purple-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {offer.category}
                </Badge>
                {offer.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    className="bg-yellow-100 text-yellow-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                {offer.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 lg:mb-6 text-sm sm:text-base">
                {offer.description}
              </p>

              {/* Pricing */}
              <div className="bg-white rounded-xl border lg:rounded-2xl p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <span className="text-2xl lg:text-3xl font-bold text-purple-600">
                        {offer.salePrice} KD
                      </span>
                      <span className="text-lg lg:text-xl text-gray-400 line-through">
                        {offer.originalPrice} KD
                      </span>
                    </div>
                    <div className="text-yellow-600 font-semibold text-sm lg:text-base">
                      You save {offer.savings} KD ({offer.discount}% off)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl lg:text-2xl font-bold text-green-600">
                      {offer.discount}%
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">Discount</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validity Information */}
            <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                Validity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">Valid Until</div>
                    <div className="text-gray-600 text-sm">{offer.expiryDate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">Hours</div>
                    <div className="text-gray-600 text-sm">{offer.validHours}</div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-4 p-3 lg:p-4 bg-purple-200 rounded-xl lg:rounded-xl">
                <div className="text-center">
                  <div className="text-xs lg:text-sm text-gray-600 mb-2">Offer expires in:</div>
                  <div className="flex justify-center space-x-2 sm:space-x-4">
                    {[
                      { value: timeLeft.days, label: 'Days' },
                      { value: timeLeft.hours, label: 'Hours' },
                      { value: timeLeft.minutes, label: 'Minutes' },
                      { value: timeLeft.seconds, label: 'Seconds' }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl text-white bg-purple-700/80 h-12 w-12 rounded-full text-center justify-center flex items-center mx-auto mb-1">
                          {item.value.toString().padStart(2, "0")}
                        </div>
                        <div className="text-xs text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl lg:rounded-3xl p-4 lg:p-6 text-white">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div>
                  <div className="text-base lg:text-lg font-semibold">Ready to claim this deal?</div>
                  <div className="text-white/80 text-sm">Join 100+ happy customers</div>
                </div>
                {offer.remaining <= 20 && (
                  <Badge className="bg-red-500 text-white rounded-full px-2 lg:px-3 py-1 animate-pulse text-xs">
                    <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    Only {offer.remaining} left!
                  </Badge>
                )}
              </div>

 
                <div className="mb-2">
                  <div className="text-xl lg:text-2xl font-bold">
                    {(offer.salePrice * quantity).toFixed(1)} KD
                  </div>
                  <div className="text-white/80 text-xs lg:text-sm">Total</div>
                </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  onClick={() => setShowClaimPopup(true)}
                  className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 rounded-xl lg:rounded-2xl py-3 lg:py-4 text-sm lg:text-lg font-semibold"
                >
                  Claim This Offer
                </Button>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>
           {showClaimPopup==true && (<OfferPopup
            />
           )}
    </>
  )
}