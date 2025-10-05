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
  Wheelchair,
  Coffee,
} from "lucide-react"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import BusinessSidebar from "@/components/offers-page/offer-id/business-sidebar"
import LocationSection from "@/components/offers-page/offer-id/location-section"
import RelatedOffers from "@/components/offers-page/offer-id/related-offers"

// Mock places data - in real app, this would come from API
const places = [
  {
    id: "1",
    name: "Kuwait Scientific Center",
    type: "Landmarks",
    rating: 4.8,
    reviewCount: 423,
    images: [
      "/kuwait-scientific-center.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "A world-class science museum and aquarium showcasing marine life, IMAX theater, and interactive exhibits about Kuwait's natural history and technology.",
    location: {
      address: "Salmiya, Kuwait City, Kuwait",
      coordinates: { lat: 29.3759, lng: 48.0036 },
      district: "Salmiya",
    },
    hours: {
      weekdays: "9:00 AM - 10:00 PM",
      weekend: "9:00 AM - 10:00 PM",
      today: "Open until 10:00 PM",
    },
    contact: {
      phone: "+965 1848 888",
      website: "www.tsck.org.kw",
      email: "info@tsck.org.kw",
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
      "Aquarium & Discovery Center",
      "IMAX Theater",
      "Interactive Exhibits",
      "Educational Programs",
    ],
  },
  {
    id: "2",
    name: "Souq Al Mubarakiya",
    type: "Shopping",
    rating: 4.4,
    reviewCount: 568,
    images: [
      "/souq-al-mubarakiya-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Traditional Kuwaiti market offering spices, gold, textiles, and local cuisine in a historic setting dating back to the 19th century.",
    location: {
      address: "Mubarakiya, Kuwait City, Kuwait",
      coordinates: { lat: 29.3759, lng: 47.9774 },
      district: "Mubarakiya",
    },
    hours: {
      weekdays: "8:00 AM - 12:00 AM",
      weekend: "8:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2243 0000",
      website: "www.mubarakiya.com",
      email: "info@mubarakiya.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: false },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: Wheelchair, label: "Wheelchair Access", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Traditional Souq Experience",
      "Local Cuisine",
      "Gold & Spice Markets",
      "Historical Architecture",
    ],
  },
  {
    id: "3",
    name: "Marina Beach",
    type: "Landmarks",
    rating: 4.3,
    reviewCount: 234,
    images: [
      "/marina-beach-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Popular waterfront promenade with beaches, restaurants, and shopping malls offering views of the Arabian Gulf.",
    location: {
      address: "Salmiya, Kuwait",
      coordinates: { lat: 29.3375, lng: 48.0758 },
      district: "Salmiya",
    },
    hours: {
      weekdays: "24 hours",
      weekend: "24 hours",
      today: "Open 24 hours",
    },
    contact: {
      phone: "+965 2571 0000",
      website: "www.marinamall.com",
      email: "info@marinamall.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Beachfront Promenade",
      "Water Views",
      "Restaurants & Shopping",
      "Outdoor Activities",
    ],
  },
  {
    id: "4",
    name: "Kuwait Towers",
    type: "Landmarks",
    rating: 4.8,
    reviewCount: 423,
    images: [
      "/kuwait-towers.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Iconic landmark featuring observation spheres with panoramic views of Kuwait City and the Arabian Gulf.",
    location: {
      address: "Arabian Gulf Street, Kuwait City, Kuwait",
      coordinates: { lat: 29.3759, lng: 47.9774 },
      district: "Dasman",
    },
    hours: {
      weekdays: "8:00 AM - 11:00 PM",
      weekend: "8:00 AM - 11:00 PM",
      today: "Open until 11:00 PM",
    },
    contact: {
      phone: "+965 2244 4000",
      website: "www.kuwaittowers.com",
      email: "info@kuwaittowers.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Panoramic Views",
      "Observation Deck",
      "Restaurant",
      "Iconic Architecture",
    ],
  },
  {
    id: "5",
    name: "The Avenues Mall",
    type: "Shopping",
    rating: 4.6,
    reviewCount: 2847,
    images: [
      "/avenues-mall-kuwait.jpg",
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
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "800+ International Brands",
      "Multiple Dining Districts",
      "Entertainment Complex",
      "Luxury Shopping Experience",
    ],
  },
  {
    id: "6",
    name: "Al Shaheed Park",
    type: "Parks",
    rating: 4.8,
    reviewCount: 423,
    images: [
      "/al-shaheed-park-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Largest urban park in Kuwait featuring gardens, museums, amphitheater, and memorials dedicated to Kuwaiti martyrs.",
    location: {
      address: "Soor Street, Kuwait City, Kuwait",
      coordinates: { lat: 29.3651, lng: 47.9763 },
      district: "Shuwaikh",
    },
    hours: {
      weekdays: "6:00 AM - 12:00 AM",
      weekend: "6:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2205 1111",
      website: "www.alshaheedpark.com",
      email: "info@alshaheedpark.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Botanical Gardens",
      "Museums & Exhibits",
      "Amphitheater",
      "Walking Paths",
    ],
  },
  {
    id: "7",
    name: "Grand Mosque",
    type: "Landmarks",
    rating: 4.9,
    reviewCount: 423,
    images: [
      "/grand-mosque-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Kuwait's largest mosque featuring Islamic architecture, grand prayer hall, and guided tours for visitors.",
    location: {
      address: "Kuwait City, Kuwait",
      coordinates: { lat: 29.3759, lng: 47.9774 },
      district: "Kuwait City",
    },
    hours: {
      weekdays: "5:00 AM - 11:00 PM",
      weekend: "5:00 AM - 11:00 PM",
      today: "Open until 11:00 PM",
    },
    contact: {
      phone: "+965 2240 0000",
      website: "www.grandmosque.com",
      email: "info@grandmosque.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: false },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: false },
      { icon: Coffee, label: "Cafes", available: false },
    ],
    highlights: [
      "Islamic Architecture",
      "Grand Prayer Hall",
      "Guided Tours",
      "Cultural Significance",
    ],
  },
  {
    id: "8",
    name: "360 Mall",
    type: "Shopping",
    rating: 4.5,
    reviewCount: 423,
    images: [
      "/360-mall-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Modern shopping mall with international brands, entertainment facilities, and dining options in a circular design.",
    location: {
      address: "Al Zahra, Kuwait",
      coordinates: { lat: 29.3016, lng: 48.0298 },
      district: "Al Zahra",
    },
    hours: {
      weekdays: "10:00 AM - 12:00 AM",
      weekend: "10:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2530 9999",
      website: "www.360mall.com",
      email: "info@360mall.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Circular Design",
      "International Brands",
      "Entertainment Zone",
      "Dining Options",
    ],
  },
  {
    id: "9",
    name: "360 Mall",
    type: "Shopping",
    rating: 4.5,
    reviewCount: 423,
    images: [
      "/360-mall-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Modern shopping mall with international brands, entertainment facilities, and dining options in a circular design.",
    location: {
      address: "Al Zahra, Kuwait",
      coordinates: { lat: 29.3016, lng: 48.0298 },
      district: "Al Zahra",
    },
    hours: {
      weekdays: "10:00 AM - 12:00 AM",
      weekend: "10:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2530 9999",
      website: "www.360mall.com",
      email: "info@360mall.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Circular Design",
      "International Brands",
      "Entertainment Zone",
      "Dining Options",
    ],
  },
  {
    id: "10",
    name: "360 Mall",
    type: "Shopping",
    rating: 4.5,
    reviewCount: 423,
    images: [
      "/360-mall-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Modern shopping mall with international brands, entertainment facilities, and dining options in a circular design.",
    location: {
      address: "Al Zahra, Kuwait",
      coordinates: { lat: 29.3016, lng: 48.0298 },
      district: "Al Zahra",
    },
    hours: {
      weekdays: "10:00 AM - 12:00 AM",
      weekend: "10:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2530 9999",
      website: "www.360mall.com",
      email: "info@360mall.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Circular Design",
      "International Brands",
      "Entertainment Zone",
      "Dining Options",
    ],
  },
  {
    id: "11",
    name: "360 Mall",
    type: "Shopping",
    rating: 4.5,
    reviewCount: 423,
    images: [
      "/360-mall-kuwait.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Modern shopping mall with international brands, entertainment facilities, and dining options in a circular design.",
    location: {
      address: "Al Zahra, Kuwait",
      coordinates: { lat: 29.3016, lng: 48.0298 },
      district: "Al Zahra",
    },
    hours: {
      weekdays: "10:00 AM - 12:00 AM",
      weekend: "10:00 AM - 12:00 AM",
      today: "Open until 12:00 AM",
    },
    contact: {
      phone: "+965 2530 9999",
      website: "www.360mall.com",
      email: "info@360mall.com",
    },
    amenities: [
      { icon: Car, label: "Free Parking", available: true },
      { icon: Wifi, label: "Free WiFi", available: true },
      { icon: Baby, label: "Baby Facilities", available: true },
      { icon: CreditCard, label: "Card Payment", available: true },
      { icon: Coffee, label: "Cafes", available: true },
    ],
    highlights: [
      "Circular Design",
      "International Brands",
      "Entertainment Zone",
      "Dining Options",
    ],
  },
]

// Type-specific content
const getTypeSpecificContent = (type: string, t: any) => {
  switch (type) {
    case "Restaurant":
      return {
        tabLabel: t("details.menu"),
        content: (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="border rounded-2xl p-4">
                <h4 className="font-semibold mb-2">{t("details.appetizers")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("details.hummus")}</span>
                    <span className="font-medium">3.5 KD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("details.mixedGrill")}</span>
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
        tabLabel: t("details.storesBrands"),
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
        tabLabel: t("details.details"),
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">{t("details.defaultDescription")}</p>
          </div>
        ),
      }
  }
}

export default function PlaceDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Find the place by id
  const placeData = places.find((place) => place.id === params.id)

  if (!placeData) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Place not found</div>
  }

  const typeContent = getTypeSpecificContent(placeData.type, t)

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("back")}
        </button>

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
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full bg-white/80 hover:bg-white ${isWishlisted ? "text-red-500" : "text-gray-600"}`}
                  >
                    <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-600">
                    <Share2 className="w-5 h-5" />
                  </button>
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
                        <span>({placeData.reviewCount} {t("reviews")})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{placeData.location.district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{placeData.description}</p>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{placeData.hours.today}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{placeData.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <a href={placeData.contact.website} className="text-sm text-blue-600 hover:underline">
                      {placeData.contact.website}
                    </a>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">{t("highlights")}</h3>
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
                  <h3 className="font-semibold mb-3">{t("amenities")}</h3>
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
                      {t("reviews")}
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="rounded-xl">
                      {t("photos")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    {typeContent.content}
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-4">
                      <p className="text-gray-600">{t("reviewsComingSoon")}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="photos" className="mt-6">
                    <div className="grid grid-cols-3 gap-4">
                      {placeData.images.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          alt={`${placeData.name} photo ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
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
                  facebook: "https://facebook.com/example",
                  instagram: "https://instagram.com/example",
                  twitter: "https://twitter.com/example",
                },
              }}
              offer={{
                rating: placeData.rating,
                reviewCount: placeData.reviewCount,
                isVerified: true,
                isOpen: true,
                openHours: placeData.hours.today,
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <RelatedOffers
          offers={[
            {
              id: "related1",
              business: "Related Business 1",
              title: "20% Off Shopping",
              image: "/placeholder.svg",
              discount: "20% OFF",
              originalPrice: 100,
              salePrice: 80,
              rating: 4.5,
            },
            {
              id: "related2",
              business: "Related Business 2",
              title: "Buy 1 Get 1 Free",
              image: "/placeholder.svg",
              discount: "B1G1",
              originalPrice: 50,
              salePrice: 50,
              rating: 4.2,
            },
          ]}
        />
      </div>
    </div>
  )
}