// types/offer.ts

export interface Offer {
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
  validDays: string[]
  validHours: string
  maxQuantity: number
  remaining: number
  totalClaimed: number
  rating: number
  reviewCount: number
  isVerified: boolean
  isOpen: boolean
  openHours: string
  images: string[]
}

export interface Business {
  name: string
  logo: string
  address: string
  phone: string
  website: string
  yearsInBusiness: number
  totalOffers: number
  satisfaction: number
  coordinates: {
    lat: number
    lng: number
  }
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
  }
}

export interface Review {
  id: number
  name: string
  avatar: string
  rating: number
  date: string
  comment: string
  verified: boolean
  helpful: number
}

export interface RelatedOffer {
  id: number
  business: string
  title: string
  image: string
  discount: string
  originalPrice: number
  salePrice: number
  rating: number
}

export interface OfferPageData {
  offer: Offer
  business: Business
  reviews: Review[]
  relatedOffers: RelatedOffer[]
}

// API Response types
export interface ClaimOfferData {
  id: number
  business: string
  title: string
  image: string
  discount: string
  originalPrice: string
  salePrice: string
  category: string
  rating: number
  location: string
  expiryDate: string
  validHours: string
  remaining: number
}

export interface BusinessInfo {
  name: string
  phone: string
  address: string
  logo: string
}