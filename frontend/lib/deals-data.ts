// app/[locale]/deals/lib/deals-data.ts
import { getTranslations } from "next-intl/server"

export interface Deal {
  id: string
  title: string
  subtitle: string
  image: string
  location: string
  rating: number
  reviewCount?: number
  originalPrice: string
  discountedPrice: string
  discountPercentage: number
  expiryDate: string | Date
  category: string
  dealType: string[]
  badge?: "trending" | "sponsored" | "new_arrival" | "expiring_soon" | null
  timerMinutes?: number
  timerSeconds?: number
}

export interface CategoryData {
  id: string
  name: string
  count: number
}

export interface StaticDealsData {
  deals: Deal[]
  flashDeals: Deal[]
  regularOffers: Deal[]
  categories: CategoryData[]
  totalCount: number
}

// Static sample data - in real app this would come from your backend/CMS
const sampleDealsData: Deal[] = [
  {
    id: "1",
    title: "Burger House, Kuwait",
    subtitle: "Jumbo Meal",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=320&h=145&fit=crop",
    location: "Kuwait City",
    rating: 4.8,
    reviewCount: 120,
    originalPrice: "20 KD",
    discountedPrice: "8 KD",
    discountPercentage: 60,
    expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2h 15m from now
    category: "restaurants",
    dealType: ["flash_deals"],
    timerMinutes: 2,
    timerSeconds: 15
  },
  {
    id: "2",
    title: "Luxury Spa Center",
    subtitle: "Full Body Massage Package",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=320&h=145&fit=crop",
    location: "Kuwait City",
    rating: 4.6,
    reviewCount: 89,
    originalPrice: "120 KD",
    discountedPrice: "60 KD",
    discountPercentage: 50,
    expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000 + 30 * 60 * 1000), // 4h 30m from now
    category: "health_beauty",
    dealType: ["flash_deals"],
    timerMinutes: 4,
    timerSeconds: 30
  },
  {
    id: "3",
    title: "Premium Burger Joint",
    subtitle: "Family Combo Deal",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=320&h=145&fit=crop",
    location: "Kuwait City",
    rating: 4.3,
    reviewCount: 95,
    originalPrice: "35 KD",
    discountedPrice: "14 KD",
    discountPercentage: 60,
    expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2h 15m from now
    category: "restaurants",
    dealType: ["flash_deals"],
    timerMinutes: 2,
    timerSeconds: 15
  },
  {
    id: "4",
    title: "Coffee Corner Cafe",
    subtitle: "Buy 2 Get 1 Free Coffee",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=320&h=150&fit=crop",
    location: "Hawalli",
    rating: 4.6,
    reviewCount: 234,
    originalPrice: "15 KD",
    discountedPrice: "6 KD",
    discountPercentage: 60,
    expiryDate: "2024-12-31",
    category: "cafes",
    dealType: ["most_popular"]
  },
  {
    id: "5",
    title: "Elite Fitness Club",
    subtitle: "3-Month Membership Deal",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=150&fit=crop",
    location: "Farwaniya",
    rating: 4.5,
    reviewCount: 156,
    originalPrice: "150 KD",
    discountedPrice: "90 KD",
    discountPercentage: 40,
    expiryDate: "2025-01-15",
    category: "health_beauty",
    dealType: ["new_arrivals"],
    badge: "sponsored"
  },
  {
    id: "6",
    title: "Sunset Hotel",
    subtitle: "Weekend Staycation Package",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=320&h=150&fit=crop",
    location: "Kuwait City",
    rating: 4.8,
    reviewCount: 89,
    originalPrice: "300 KD",
    discountedPrice: "182 KD",
    discountPercentage: 60,
    expiryDate: "2025-02-28",
    category: "hotels",
    dealType: ["expiring_soon"]
  },
  {
    id: "7",
    title: "Trendy Hair Salon",
    subtitle: "Complete Hair Makeover",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=320&h=150&fit=crop",
    location: "Kuwait City",
    rating: 4.7,
    reviewCount: 143,
    originalPrice: "80 KD",
    discountedPrice: "32 KD",
    discountPercentage: 60,
    expiryDate: "2025-01-20",
    category: "salons",
    dealType: ["trending"],
    badge: "trending"
  },
  {
    id: "8",
    title: "Cinema Complex",
    subtitle: "Movie Night Package for 4",
    image: "https://images.unsplash.com/photo-1489599117333-089e7c9ee00e?w=320&h=150&fit=crop",
    location: "Ahmadi",
    rating: 4.4,
    reviewCount: 267,
    originalPrice: "60 KD",
    discountedPrice: "36 KD",
    discountPercentage: 40,
    expiryDate: "2025-03-15",
    category: "entertainment",
    dealType: ["most_popular"]
  },
  {
    id: "9",
    title: "Shopping Mall Vouchers",
    subtitle: "Fashion & Electronics Bundle",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=320&h=150&fit=crop",
    location: "Jahra",
    rating: 4.2,
    reviewCount: 178,
    originalPrice: "200 KD",
    discountedPrice: "120 KD",
    discountPercentage: 40,
    expiryDate: "2025-02-10",
    category: "shopping",
    dealType: ["new_arrivals"]
  },
  {
    id: "10",
    title: "Auto Service Center",
    subtitle: "Complete Car Maintenance Package",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=320&h=150&fit=crop",
    location: "Mubarak Al-Kabeer",
    rating: 4.1,
    reviewCount: 67,
    originalPrice: "120 KD",
    discountedPrice: "84 KD",
    discountPercentage: 30,
    expiryDate: "2025-04-30",
    category: "automotive",
    dealType: ["most_popular"]
  }
]

export async function generateStaticDealsData(locale: string): Promise<StaticDealsData> {
  const t = await getTranslations('Checkbox')
  
  // Calculate category counts
  const categoryCounts = sampleDealsData.reduce((acc, deal) => {
    acc[deal.category] = (acc[deal.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories: CategoryData[] = [
    { id: "restaurants", name: t("restaurants"), count: categoryCounts.restaurants || 0 },
    { id: "hotels", name: t("hotels"), count: categoryCounts.hotels || 0 },
    { id: "cafes", name: t("cafes"), count: categoryCounts.cafes || 0 },
    { id: "salons", name: t("salons"), count: categoryCounts.salons || 0 },
    { id: "entertainment", name: t("entertainment"), count: categoryCounts.entertainment || 0 },
    { id: "shopping", name: t("shopping"), count: categoryCounts.shopping || 0 },
    { id: "health_beauty", name: t("health_beauty"), count: categoryCounts.health_beauty || 0 },
    { id: "automotive", name: t("automotive"), count: categoryCounts.automotive || 0 }
  ].filter(category => category.count > 0)

  const flashDeals = sampleDealsData.filter(deal => deal.dealType.includes("flash_deals"))
  const regularOffers = sampleDealsData.filter(deal => !deal.dealType.includes("flash_deals"))

  return {
    deals: sampleDealsData,
    flashDeals,
    regularOffers,
    categories,
    totalCount: sampleDealsData.length
  }
}

// Utility function to get localized category name
export function getCategoryName(categoryId: string, t: any): string {
  const categoryNames: Record<string, string> = {
    restaurants: t("restaurants"),
    hotels: t("hotels"),
    cafes: t("cafes"),
    salons: t("salons"),
    entertainment: t("entertainment"),
    shopping: t("shopping"),
    health_beauty: t("health_beauty"),
    automotive: t("automotive")
  }
  
  return categoryNames[categoryId] || categoryId
}