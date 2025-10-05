"use client"
import MarketplaceProductHero from "@/components/marketplace/product/marketplace-product-hero"
import MarketplaceProductDetails from "@/components/marketplace/product/marketplace-product-detail"
import BusinessSidebar from "@/components/marketplace/business-sidebar"
import LocationSection from "@/components/marketplace/location-section"
import ReviewsSection from "@/components/marketplace/reviews-section"
import RelatedOffers from "@/components/marketplace/related-items"


// Mock data - in real app, this would come from API based on the ID
const getProductData = (id: string) => ({
  id,
  name: "iPhone 15 Pro Max",
  brand: "Apple",
  image: "/placeholder.svg?height=400&width=600",
  rating: 4.6,
  reviewCount: 234,
  price: 450,
  originalPrice: 520,
  discount: 13,
  description: "256GB, Titanium Blue, Unlocked",
  condition: "brand_new",
  seller: "TechZone Kuwait",
  inStock: true,
  location: "kuwait-city",
  category: "Electronics & Technology",
  subcategory: "mobile",
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
    comment:
      "Amazing product! The phone was perfectly packaged and the service was excellent. Definitely worth the deal!",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    name: "Sarah Al-Kuwait",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "1 week ago",
    comment: "Great value for money. The phone condition was exactly as described and the seller was very responsive.",
    verified: true,
    helpful: 8,
  },
]

const mockRelatedProducts = [
  {
    id: 2,
    business: "Apple Store Kuwait",
    title: 'MacBook Pro 16"',
    image: "/placeholder.svg?height=200&width=300",
    discount: "11% OFF",
    originalPrice: 1350,
    salePrice: 1200,
    rating: 4.5,
  },
  {
    id: 3,
    business: "Samsung Store Kuwait",
    title: "Galaxy S24 Ultra",
    image: "/placeholder.svg?height=200&width=300",
    discount: "10% OFF",
    originalPrice: 420,
    salePrice: 380,
    rating: 4.4,
  },
  {
    id: 4,
    business: "Audio Pro Kuwait",
    title: "Sony WH-1000XM5",
    image: "/placeholder.svg?height=200&width=300",
    discount: "20% OFF",
    originalPrice: 150,
    salePrice: 120,
    rating: 4.7,
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductData(params.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <MarketplaceProductHero product={product} />
            <MarketplaceProductDetails product={product} />
            <LocationSection
              business={{
                name: product.seller,
                address: "Gulf Road, Kuwait City, Kuwait",
                coordinates: { lat: 29.3759, lng: 47.9774 },
              }}
            />
            <ReviewsSection
              reviews={mockReviews}
              offer={{
                rating: product.rating,
                reviewCount: product.reviewCount,
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:block mt-4">
            <BusinessSidebar
              business={{
                name: product.seller,
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
                rating: product.rating,
                reviewCount: product.reviewCount,
                isVerified: true,
                isOpen: true,
                openHours: "9:00 AM - 10:00 PM",
              }}
            />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedOffers isProduct={true} />
        </div>
      </div>
    </div>
  )
}