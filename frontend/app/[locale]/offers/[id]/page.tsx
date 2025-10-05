import { notFound } from 'next/navigation'
import OfferHero from '@/components/offers-page/offer-id/offerhero'
import OfferDetails from '@/components/offers-page/offer-id/offer-details'
import LocationSection from '@/components/offers-page/offer-id/location-section'
import ReviewsSection from '@/components/offers-page/offer-id/review-section'
import BusinessSidebar from '@/components/offers-page/offer-id/business-sidebar'
import RelatedOffers from '@/components/offers-page/offer-id/related-offers'
import StickyBottomCTA from '@/components/offers-page/offer-id/stickey-bottom'
import { Metadata } from 'next'

interface OfferPageProps {
  params: {
    id: string
  }
}

// This would typically fetch data from your API/database
async function getOfferData(id: string) {
  // Simulate API call - replace with actual data fetching
  if (!id || id === '0') {
    return null
  }

  return {
    offer: {
      id: parseInt(id),
      business: "Al Boom Restaurant",
      title: "Traditional Kuwaiti Feast for 4 People",
      description: "Experience authentic Kuwaiti cuisine with our signature feast including machboos, mutabbaq samak, and traditional desserts. Perfect for families and groups looking to explore local flavors.",
      originalPrice: 120,
      salePrice: 48,
      discount: 60,
      savings: 72,
      category: "Restaurants",
      tags: ["Limited Time", "Popular", "Family Friendly"],
      expiryDate: "December 31, 2024",
      validDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      validHours: "12:00 PM - 10:00 PM",
      maxQuantity: 3,
      remaining: 15,
      totalClaimed: 127,
      rating: 4.8,
      reviewCount: 234,
      isVerified: true,
      isOpen: true,
      openHours: "11:00 AM - 11:00 PM",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600", 
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ]
    },
    business: {
      name: "Al Boom Restaurant",
      logo: "/placeholder.svg?height=80&width=80",
      address: "Gulf Road, Kuwait City, Kuwait",
      phone: "+965 2222 3333",
      website: "www.alboom-restaurant.com",
      yearsInBusiness: 15,
      totalOffers: 8,
      satisfaction: 96,
      coordinates: { lat: 29.3759, lng: 47.9774 },
      socialMedia: {
        facebook: "alboomrestaurant",
        instagram: "alboom_kw",
        twitter: "alboomkw",
      },
    },
    reviews: [
      {
        id: 1,
        name: "Sarah Al-Kuwait",
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 5,
        date: "2 days ago",
        comment: "Amazing traditional food! The machboos was perfectly spiced and the service was excellent. Definitely worth the deal!",
        verified: true,
        helpful: 12,
      },
      {
        id: 2,
        name: "Ahmed Hassan", 
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 5,
        date: "1 week ago",
        comment: "Great value for money. The portion sizes were generous and the atmosphere was authentic. Will definitely come back!",
        verified: true,
        helpful: 8,
      },
      {
        id: 3,
        name: "Fatima Al-Sabah",
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 4,
        date: "2 weeks ago",
        comment: "Good food and nice ambiance. The staff was friendly and accommodating. Perfect for family dinners.",
        verified: false,
        helpful: 5,
      },
    ],
    relatedOffers: [
      {
        id: 2,
        business: "Heritage Cafe",
        title: "Traditional Breakfast Set",
        image: "/placeholder.svg?height=150&width=200",
        discount: "40% OFF",
        originalPrice: 25,
        salePrice: 15,
        rating: 4.6,
      },
      {
        id: 3,
        business: "Spice Garden", 
        title: "Lunch Buffet Special",
        image: "/placeholder.svg?height=150&width=200",
        discount: "50% OFF",
        originalPrice: 35,
        salePrice: 17.5,
        rating: 4.7,
      },
      {
        id: 4,
        business: "Desert Rose Restaurant",
        title: "Romantic Dinner for Two",
        image: "/placeholder.svg?height=150&width=200",
        discount: "35% OFF",
        originalPrice: 80,
        salePrice: 52,
        rating: 4.9,
      },
    ]
  }
}


export default async function OfferPage(props: { params: Promise<OfferPageProps['params']> }) {
  const params = await props.params
  const data = await getOfferData(params.id)

  if (!data) {
    notFound()
  }

  const { offer, business, reviews, relatedOffers } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <OfferHero offer={offer} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-8">
            <OfferDetails offer={offer} />
            <LocationSection business={business} />
            <ReviewsSection reviews={reviews} offer={offer} />
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <BusinessSidebar business={business} offer={offer} />
          </div>
        </div>

        {/* Related Offers */}
        <div className="mt-8 lg:mt-16">
          <RelatedOffers offers={relatedOffers} />
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <StickyBottomCTA offer={offer} />
    </div>
  )
}

export async function generateMetadata(
  props: { params: Promise<OfferPageProps['params']> }
): Promise<Metadata> {  const params = await props.params
  const data = await getOfferData(params.id)
  
  if (!data) {
    return {
      title: 'Offer Not Found',
      description: 'The requested offer could not be found.',
    }
  }

  const { offer, business } = data

  return {
    title: `${offer.title} - ${business.name} | ${offer.discount}% OFF`,
    description: offer.description,
    keywords: [
      offer.category.toLowerCase(),
      business.name.toLowerCase(),
      'discount',
      'offer',
      'deal',
      'kuwait'
    ].join(', '),
    openGraph: {
      title: `${offer.title} - Save ${offer.discount}%`,
      description: offer.description,
      images: [
        {
          url: offer.images[0],
          width: 600,
          height: 400,
          alt: offer.title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${offer.title} - ${offer.discount}% OFF`,
      description: offer.description,
      images: [offer.images[0]],
    },
  }
}

// Generate static params for popular offers (optional)
export async function generateStaticParams() {
  // In production, fetch popular offer IDs from your API
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    // Add more popular offer IDs
  ]
}