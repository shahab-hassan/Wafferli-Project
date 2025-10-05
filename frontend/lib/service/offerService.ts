// lib/services/offerService.ts
import { OfferPageData, RelatedOffer } from '@/types/offer'

// Mock data - replace with actual API calls
const MOCK_OFFER_DATA: Record<string, OfferPageData> = {
  '1': {
    offer: {
      id: 1,
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

export class OfferService {
  /**
   * Fetch offer details by ID
   * In a real application, this would make an HTTP request to your API
   */
  static async getOfferById(id: string): Promise<OfferPageData | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // In production, replace with actual API call:
      // const response = await fetch(`/api/offers/${id}`)
      // if (!response.ok) return null
      // return response.json()
      
      return MOCK_OFFER_DATA[id] || null
    } catch (error) {
      console.error('Error fetching offer:', error)
      return null
    }
  }

  /**
   * Fetch related offers by category or business
   */
  static async getRelatedOffers(
    offerId: string, 
    category?: string, 
    limit: number = 3
  ): Promise<RelatedOffer[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // In production, replace with actual API call:
      // const response = await fetch(`/api/offers/related/${offerId}?category=${category}&limit=${limit}`)
      // return response.json()
      
      const currentOffer = MOCK_OFFER_DATA[offerId]
      return currentOffer?.relatedOffers.slice(0, limit) || []
    } catch (error) {
      console.error('Error fetching related offers:', error)
      return []
    }
  }

  /**
   * Submit a review for an offer
   */
  static async submitReview(
    offerId: string, 
    reviewData: {
      rating: number
      comment: string
      userName: string
    }
  ): Promise<boolean> {
    try {
      // In production, replace with actual API call:
      // const response = await fetch(`/api/offers/${offerId}/reviews`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reviewData)
      // })
      // return response.ok
      
      console.log('Review submitted:', { offerId, reviewData })
      return true
    } catch (error) {
      console.error('Error submitting review:', error)
      return false
    }
  }

  /**
   * Claim an offer
   */
  static async claimOffer(
    offerId: string,
    quantity: number = 1
  ): Promise<{ success: boolean; claimId?: string }> {
    try {
      // In production, replace with actual API call:
      // const response = await fetch(`/api/offers/${offerId}/claim`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ quantity })
      // })
      // const result = await response.json()
      // return result
      
      console.log('Offer claimed:', { offerId, quantity })
      return { 
        success: true, 
        claimId: `claim_${Date.now()}_${offerId}` 
      }
    } catch (error) {
      console.error('Error claiming offer:', error)
      return { success: false }
    }
  }

  /**
   * Toggle wishlist status
   */
  static async toggleWishlist(
    offerId: string, 
    isWishlisted: boolean
  ): Promise<boolean> {
    try {
      // In production, replace with actual API call:
      // const response = await fetch(`/api/offers/${offerId}/wishlist`, {
      //   method: isWishlisted ? 'POST' : 'DELETE'
      // })
      // return response.ok
      
      console.log('Wishlist toggled:', { offerId, isWishlisted })
      return true
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      return false
    }
  }
}