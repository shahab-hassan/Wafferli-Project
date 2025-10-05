"use client"
import MarketplaceServiceHero from "@/components/marketplace/services/marketplace-service-hero"
import MarketplaceServiceDetails from "@/components/marketplace/services/marketplace-service-detail"
import BusinessSidebar from "@/components/marketplace/business-sidebar"
import LocationSection from "@/components/marketplace/location-section"
import ReviewsSection from "@/components/marketplace/reviews-section"
import RelatedOffers from "@/components/marketplace/related-items"

// Mock data - in real app, this would come from API based on the ID
const getServiceData = (id: string) => ({
  id,
  name: "AC Repair & Maintenance",
  category: "Home & Personal Services",
  subcategory: "Repair",
  image: "/placeholder.svg?height=400&width=600",
  rating: 4.6,
  reviewCount: 124,
  startingPrice: 15,
  description: "24/7 emergency AC repair service",
  seller: "TechZone Kuwait",
  location: "kuwait-city",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
})

const mockReviews = [
  {
    id: 1,
    name: "Ahmed Hassan",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent service! They fixed my AC quickly and professionally. Highly recommended!",
    verified: true,
    helpful: 15,
  },
  {
    id: 2,
    name: "Sarah Al-Kuwait",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "1 week ago",
    comment: "Good service and fair pricing. The technician was knowledgeable and friendly.",
    verified: true,
    helpful: 9,
  },
]

const mockRelatedServices = [
  {
    id: 2,
    business: "Clean Pro Kuwait",
    title: "House Cleaning Service",
    image: "/placeholder.svg?height=200&width=300",
    discount: "20% OFF",
    originalPrice: 30,
    salePrice: 25,
    rating: 4.8,
  },
  {
    id: 3,
    business: "Kuwait Legal Experts",
    title: "Legal Consultation",
    image: "/placeholder.svg?height=200&width=300",
    discount: "15% OFF",
    originalPrice: 60,
    salePrice: 50,
    rating: 4.9,
  },
  {
    id: 4,
    business: "Beauty Pro Kuwait",
    title: "Home Beauty Service",
    image: "/placeholder.svg?height=200&width=300",
    discount: "25% OFF",
    originalPrice: 40,
    salePrice: 30,
    rating: 4.7,
  },
]

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = getServiceData(params.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <MarketplaceServiceHero service={service} />
            <MarketplaceServiceDetails service={service} />
            <LocationSection
              business={{
                name: service.seller,
                address: "Gulf Road, Kuwait City, Kuwait",
                coordinates: { lat: 29.3759, lng: 47.9774 },
              }}
            />
            <ReviewsSection
              reviews={mockReviews}
              offer={{
                rating: service.rating,
                reviewCount: service.reviewCount,
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:block mt-4">
            <BusinessSidebar
              business={{
                name: service.seller,
                logo: "/placeholder.svg?height=80&width=80",
                address: "Gulf Road, Kuwait City, Kuwait",
                phone: "+965 2222 3333",
                website: "www.techzone-kuwait.com",
                yearsInBusiness: 5,
                totalOffers: 12,
                satisfaction: 95,
                socialMedia: {
                  facebook: "https://facebook.com/techzonekuwait",
                  instagram: "https://instagram.com/techzonekuwait",
                  twitter: "https://twitter.com/techzonekuwait",
                },
              }}
              offer={{
                rating: service.rating,
                reviewCount: service.reviewCount,
                isVerified: true,
                isOpen: true,
                openHours: "9:00 AM - 10:00 PM",
              }}
            />
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-12">
          <RelatedOffers isProduct={false} />
        </div>
      </div>
    </div>
  )
}