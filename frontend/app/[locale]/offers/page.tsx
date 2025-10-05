"use client"
import { useState, useEffect, useMemo } from "react"
import {
  Search,
  MapPin,
  Filter,
  Clock,
  Zap,
  X,
  ArrowUp,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/common/button"
import { TextField } from "@/components/common/text-field"
import { Badge } from "@/components/common/badge"
import { Dropdown, DropdownOption } from "@/components/common/dropdown"
import {FlashCard} from "@/components/cards/flash-card"
import {OfferCard} from "@/components/cards/offer-card"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { useMediaQuery } from 'react-responsive'
import FilterSidebar from "@/components/offers-page/side-bar"
import OfferPopup from "@/components/common/offer-popup/offer-popup"

interface ActiveFilters {
  categories: string[]
  location: string
  distance: number[]
  priceRange: number[]
  discountRange: number[]
  rating: number
  types: string[]
}

interface FlashDeal {
  id: string
  title: string
  subtitle: string
  image: string
  location: string
  rating: number
  reviewCount: number
  originalPrice: string
  discountedPrice: string
  discountPercentage: number
  expiryDate: string
  timerMinutes: number
  timerSeconds: number
}

interface Offer {
  id: string
  title: string
  subtitle: string
  image: string
  location: string
  rating: number
  reviewCount: number
  originalPrice: string
  discountedPrice: string
  discountPercentage: number
  expiryDate: string
  badge?: "new_arrival" | "sponsored" | "trending" | "expiring_soon" | null
}

interface SearchAndFilterSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  getActiveFilterCount: () => number
}

interface SortAndViewOptionsProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

// Interactive Components
function SearchAndFilterSection({ searchQuery, setSearchQuery, showFilters, setShowFilters, getActiveFilterCount }: SearchAndFilterSectionProps) {
  const t = useTranslations()
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' })

  
  return (
    <div className="flex flex-row gap-4 items-center mb-10">
      
      <Button
      variant="normal"
        onClick={() => setShowFilters(!showFilters)}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-8 py-3 sm:py-5 relative text-white font-medium shrink-0"
      >
        <Filter className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
       {isDesktop ? t('filters') : ""}
        {getActiveFilterCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>
      <div className="relative flex-1">
        <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-grey-3 z-2" />
        <TextField
          type="text"
          placeholder={t('search_placeholder')}
          className="pl-4 sm:pl-14 pr-16 py-3 sm:py- focus:border-primary focus:ring-primary text-normal-regular bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
          <button className="p-1.5 sm:p-2.5 rounded-full bg-grey-5 hover:bg-grey-4 transition-colors">
            <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-grey-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SortAndViewOptions({ sortBy, setSortBy, }: SortAndViewOptionsProps) {
  const t = useTranslations()
  
  const sortOptions: DropdownOption[] = [
    { value: "newest", label: t('newest_first') },
    { value: "ending", label: t('ending_soon') },
    { value: "discount", label: t('highest_discount') },
    { value: "popular", label: t('most_popular') },
    { value: "nearest", label: t('nearest') },
  ]

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">{t('available_offers')}</h2>
        <p className="text-normal-regular text-muted-foreground">{t('showing_deals')} 247</p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Sort Options */}
        <div className="min-w-[200px]">
          <Dropdown
            placeholder="Sort by"
            options={sortOptions}
            value={sortBy}
            onValueChange={setSortBy}
            variant="rounded"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

function FlashDealsSection() {
  const t = useTranslations()
  const [flashDealsTime, setFlashDealsTime] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 5, 
    minutes: 23, 
    seconds: 45 
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashDealsTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const flashDeals = useMemo<FlashDeal[]>(() => [
    {
      id: "1",
      title: t('traditional_kuwaiti_feast'),
      subtitle: t('al_boom_restaurant'),
      image: "/placeholder.svg?height=200&width=300&text=Al+Boom+Restaurant",
      location: t('kuwait_city'),
      rating: 4.8,
      reviewCount: 234,
      originalPrice: "45 KD",
      discountedPrice: "18 KD",
      discountPercentage: 60,
      expiryDate: "2026-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "2",
      title: t('full_body_massage_package'),
      subtitle: t('luxury_spa_center'),
      image: "/placeholder.svg?height=200&width=300&text=Luxury+Spa",
      location: t('salmiya'),
      rating: 4.9,
      reviewCount: 156,
      originalPrice: "120 KD",
      discountedPrice: "60 KD",
      discountPercentage: 50,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 30,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "3",
      title: t('designer_collection_sale'),
      subtitle: t('fashion_boutique'),
      image: "/placeholder.svg?height=200&width=300&text=Fashion+Boutique",
      location: t('avenues_mall'),
      rating: 4.7,
      reviewCount: 89,
      originalPrice: "200 KD",
      discountedPrice: "60 KD",
      discountPercentage: 70,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 30,
      timerSeconds: flashDealsTime.seconds,
    },
  ], [t, flashDealsTime])

  return (
    <div className="mb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <Zap className="w-8 h-8 text-tertiary" />
          <h3 className="text-h5 text-foreground font-bold">{t('flash_deals')}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-tertiary text-primary rounded-full px-4 py-2 font-medium">
            {t('limited_time')}
          </Badge>
          <div className="flex items-center space-x-3 bg-tertiary rounded-[100px] px-2 py-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary text-small-semibold">
              {flashDealsTime.hours.toString().padStart(2, "0")}:
              {flashDealsTime.minutes.toString().padStart(2, "0")}:
              {flashDealsTime.seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {flashDeals.map((deal) => (
          <FlashCard
            key={deal.id}
            {...deal}
            isResponsive={true}
            className="hover:scale-105 transition-transform duration-300 mx-auto w-full max-w-md"
          />
        ))}
      </div>
    </div>
  )
}

export default function OffersPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    location: "",
    distance: [5],
    priceRange: [0, 1000],
    discountRange: [0, 100],
    rating: 0,
    types: [],
  })

  const [showClaimPopup, setShowClaimPopup] = useState<boolean>(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFilter = (type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "categories") {
        const categories = prev.categories.includes(value)
          ? prev.categories.filter((c) => c !== value)
          : [...prev.categories, value]
        return { ...prev, categories }
      }
      if (type === "types") {
        const types = prev.types.includes(value) ? prev.types.filter((t) => t !== value) : [...prev.types, value]
        return { ...prev, types }
      }
      return { ...prev, [type]: value }
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      location: "",
      distance: [5],
      priceRange: [0, 1000],
      discountRange: [0, 100],
      rating: 0,
      types: [],
    })
  }

  const getActiveFilterCount = (): number => {
    return (
      activeFilters.categories.length +
      activeFilters.types.length +
      (activeFilters.location ? 1 : 0) +
      (activeFilters.rating > 0 ? 1 : 0)
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClaimOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowClaimPopup(true)
  }

  // Regular offers data
  const regularOffers = useMemo<Offer[]>(() => [
    {
      id: "4",
      title: t('buy_2_get_1_free_coffee'),
      subtitle: t('coffee_corner_cafe'),
      image: "/placeholder.svg?height=200&width=300&text=Coffee+Corner",
      location: t('hawalli'),
      rating: 4.6,
      reviewCount: 123,
      originalPrice: "9 KD",
      discountedPrice: "6 KD",
      discountPercentage: 33,
      expiryDate: "2024-12-31",
      badge: "new_arrival",
    },
    {
      id: "5",
      title: t('3_month_membership_deal'),
      subtitle: t('elite_fitness_club'),
      image: "/placeholder.svg?height=200&width=300&text=Elite+Fitness",
      location: t('farwaniya'),
      rating: 4.5,
      reviewCount: 87,
      originalPrice: "150 KD",
      discountedPrice: "90 KD",
      discountPercentage: 40,
      expiryDate: "2026-01-15",
      badge: "sponsored",
    },
    {
      id: "6",
      title: t('weekend_staycation_package'),
      subtitle: t('sunset_hotel'),
      image: "/placeholder.svg?height=200&width=300&text=Sunset+Hotel",
      location: t('kuwait_city'),
      rating: 4.8,
      reviewCount: 234,
      originalPrice: "280 KD",
      discountedPrice: "182 KD",
      discountPercentage: 35,
      expiryDate: "2025-02-28",
      badge: null,
    },
  ], [t])

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar */}
          <FilterSidebar 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filter Section */}
            <SearchAndFilterSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              getActiveFilterCount={getActiveFilterCount}
            />

            {/* Active Filter Tags */}
            {(activeFilters.categories.length > 0 || activeFilters.types.length > 0) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {activeFilters.categories.map((category) => (
                  <Badge
                    key={category}
                    className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    <span>{category}</span>
                    <button onClick={() => toggleFilter("categories", category)}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.types.map((type) => (
                  <Badge
                    key={type}
                    className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    <span>{type}</span>
                    <button onClick={() => toggleFilter("types", type)}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  {t('clear_all')}
                </Button>
              </div>
            )}

            {/* Sort & View Options */}
            <SortAndViewOptions
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Flash Deals Section */}
            <FlashDealsSection />

            {/* Regular Offers Grid */}
            <div className="mb-12">
              <h3 className="text-h5 text-foreground font-bold mb-8">{t('all_offers')}</h3>

              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center" 
                  : "space-y-6"
              )}>
                {regularOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    {...offer}
                    isResponsive={true}
                    className={cn(
                      viewMode === "list" ? "w-full flex flex-col sm:flex-row h-auto gap-4" : "w-full max-w-md",
                      viewMode === "grid" && "mx-auto"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-10 py-4 border-border text-primary hover:bg-accent font-medium"
              >
                {t('load_more_deals')}
                <TrendingUp className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Claim Offer Popup */}
      {selectedOffer && (
        <OfferPopup
        />
      )}
    </div>
  )
}


