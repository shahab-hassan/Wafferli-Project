"use client"
import Image from "next/image"
import Link from "next/link"
import {
  Phone,
  MapPin,
  ExternalLink,
  Star,
  Check,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"

interface BusinessSidebarProps {
  business: {
    id: string // Added id for navigation
    name: string
    logo: string
    address: string
    phone: string
    website: string
    yearsInBusiness: number
    totalOffers: number
    satisfaction: number
    socialMedia: {
      facebook: string
      instagram: string
      twitter: string
    }
  }
  offer: {
    rating: number
    reviewCount: number
    isVerified: boolean
    isOpen: boolean
    openHours: string
  }
}

export default function BusinessSidebar({ business, offer }: BusinessSidebarProps) {
  const handlePhoneCall = () => {
    window.location.href = `tel:${business.phone}`
  }

  const handleWebsiteVisit = () => {
    window.open(`https://${business.website}`, "_blank", "noopener,noreferrer")
  }

  const handleSocialClick = (platform: string, username: string) => {
    let url = ""
    switch (platform) {
      case "facebook":
        url = `https://facebook.com/${username}`
        break
      case "instagram":
        url = `https://instagram.com/${username}`
        break
      case "twitter":
        url = `https://twitter.com/${username}`
        break
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="rounded-2xl lg:rounded-3xl border sticky top-4 lg:top-8 ">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-4 lg:mb-6">
          <div className="relative inline-block mb-3 lg:mb-4">
            <Image
              src={business.logo}
              alt={business.name}
              width={60}
              height={60}
              className="rounded-full mx-auto w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
            />
            {offer.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 lg:p-1">
                <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
            )}
          </div>

          <Link href={`/profile/business/${business.id}`}>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors cursor-pointer">
              {business.name}
            </h3>
          </Link>

          <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-3 lg:mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 lg:w-4 lg:h-4 ${
                    i < Math.floor(offer.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs lg:text-sm text-gray-600">({offer.reviewCount} reviews)</span>
          </div>

          <Badge
            className={`rounded-full px-2 lg:px-3 py-1 text-xs lg:text-sm ${
              offer.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {offer.isOpen ? "Open Now" : "Closed"} • {offer.openHours}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
          <button
            onClick={handlePhoneCall}
            className="flex items-center space-x-2 lg:space-x-3 w-full text-left hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
            <span className="text-primary hover:text-secondary font-medium text-sm lg:text-base">
              {business.phone}
            </span>
          </button>

          <div className="flex items-start space-x-2 lg:space-x-3 p-1">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm lg:text-base leading-relaxed">{business.address}</span>
          </div>

          <button
            onClick={handleWebsiteVisit}
            className="flex items-center space-x-2 lg:space-x-3 w-full text-left hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
            <span className="text-primary hover:text-secondary text-sm lg:text-base">{business.website}</span>
          </button>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
          <button
            onClick={() => handleSocialClick("facebook", business.socialMedia.facebook)}
            className="p-2 lg:p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          >
            <Facebook className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <button
            onClick={() => handleSocialClick("instagram", business.socialMedia.instagram)}
            className="p-2 lg:p-3 bg-pink-100 text-secondary rounded-full hover:bg-pink-200 transition-colors"
          >
            <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <button
            onClick={() => handleSocialClick("twitter", business.socialMedia.twitter)}
            className="p-2 lg:p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          >
            <Twitter className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-row gap-2 lg:gap-4 text-center">
          <Button variant="primary" leadingIcon={<MessageCircle className="w-4 h-4" />} className="w-full">
            Chat
          </Button>
          <Button variant="outline" leadingIcon={<Send className="w-4 h-4 bg-transparent" />} className="w-full">
            Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}