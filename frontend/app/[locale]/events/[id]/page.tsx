"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Calendar,
  Users,
  Wifi,
  Car,
  CreditCard,
  Baby,
  ShipWheelIcon as Wheelchair,
  Coffee,
  TreePine,
} from "lucide-react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import Link from "next/link"
import Image from "next/image"

import BusinessSidebar from "@/components/offers-page/offer-id/business-sidebar"
import LocationSection from "@/components/offers-page/offer-id/location-section"
import RelatedOffers from "@/components/offers-page/offer-id/related-offers"

// Mock data - in real app, this would come from API based on the ID
const placeData = {
  id: "1",
  name: "The Avenues Mall",
  type: "Shopping",
  rating: 4.6,
  reviewCount: 2847,
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  description:
    "Kuwait's premier shopping destination featuring over 800 stores, international brands, dining options, and entertainment facilities across multiple districts.",
  location: {
    address: "Al Rai, Kuwait City, Kuwait",
    coordinates: { lat: 29.3117, lng: 47.9067 },
    district: "Al Rai",
  },
  hours: {
    weekdays: "10:00 AM - 12:00 AM",
    weekend: "10:00 AM - 1:00 AM",
    today: "Open until 12:00 AM",
  },
  contact: {
    phone: "+965 1844 409",
    website: "www.theavenues.com.kw",
    email: "info@theavenues.com.kw",
  },
  amenities: [
    { icon: Car, label: "Free Parking", available: true },
    { icon: Wifi, label: "Free WiFi", available: true },
    { icon: Baby, label: "Baby Facilities", available: true },
    { icon: Wheelchair, label: "Wheelchair Access", available: true },
    { icon: CreditCard, label: "Card Payment", available: true },
    { icon: Coffee, label: "Cafes", available: true },
  ],
  highlights: [
    "800+ International Brands",
    "Multiple Dining Districts",
    "Entertainment Complex",
    "Luxury Shopping Experience",
  ],
}

// Type-specific content
const getTypeSpecificContent = (type: string) => {
  switch (type) {
    case "Restaurant":
      return {
        tabLabel: "Menu",
        content: (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="border rounded-2xl p-4">
                <h4 className="font-semibold mb-2">Appetizers</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hummus with Pita</span>
                    <span className="font-medium">3.5 KD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mixed Grill Platter</span>
                    <span className="font-medium">8.5 KD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      }
    case "Shopping":
      return {
        tabLabel: "Stores & Brands",
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Zara", "H&M", "Apple Store", "Sephora", "Nike", "Adidas"].map((brand) => (
                <div key={brand} className="border rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-2"></div>
                  <span className="text-sm font-medium">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      }
    default:
      return {
        tabLabel: "Details",
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">Detailed information about this location.</p>
          </div>
        ),
      }
  }
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const typeContent = getTypeSpecificContent(placeData.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-3xl">
              <div className="relative h-96">
                <Image
                  src={placeData.images[currentImageIndex] || "/placeholder.svg"}
                  alt={placeData.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white">{placeData.type}</Badge>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {placeData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Place Info */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{placeData.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{placeData.rating}</span>
                        <span>({placeData.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{placeData.location.district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{placeData.description}</p>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Highlights</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {placeData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {placeData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <amenity.icon className={`w-4 h-4 ${amenity.available ? "text-green-600" : "text-gray-400"}`} />
                        <span className={amenity.available ? "" : "text-gray-400 line-through"}>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Section */}
            <LocationSection business={placeData.location} />

            {/* Type-specific Content Tabs */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="details" className="rounded-xl">
                      {typeContent.tabLabel}
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl">
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="rounded-xl">
                      Photos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    {typeContent.content}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Related Offers */}
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <BusinessSidebar
                          business={{
                              name: placeData.name,
                              logo: placeData.images[0] || "/placeholder.svg",
                              address: placeData.location.address,
                              phone: placeData.contact.phone,
                              website: placeData.contact.website,
                              yearsInBusiness: 10,
                              totalOffers: 5,
                              satisfaction: 95,
                              socialMedia: {
                                  facebook: "https://facebook.com/theavenues",
                                  instagram: "https://instagram.com/theavenues",
                                  twitter: "https://twitter.com/theavenues",
                              },
                          }} offer={{
                              rating: 0,
                              reviewCount: 0,
                              isVerified: false,
                              isOpen: false,
                              openHours: ""
                          }}            />
          </div>
        </div>
        
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-12">
                  <RelatedOffers offers={[{ id: 1, business: "Sample", title: "Offer Title", image: "/placeholder.svg", discount: "20% OFF", originalPrice: 100, salePrice: 80, rating: 4.5 }]} />
</div>
    </div>
  )
}
