"use client"
import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Filter,
  Clock,
  Zap,
  X,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/common/button"
import { TextField } from "@/components/common/text-field"
import { Badge } from "@/components/common/badge"
import { Dropdown, DropdownOption } from "@/components/common/dropdown"
import {FlashCard} from "@/components/cards/flash-card"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { useMediaQuery } from 'react-responsive'
import FilterSidebar from "@/components/offers-page/side-bar"
import { Pagination } from "@/components/common/pagination"


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
        <h2 className="text-h5 text-foreground font-bold mb-2">{t('flash_deals')}</h2>
        <p className="text-normal-regular text-muted-foreground">{t('showing_deals')} 14</p>
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

export default function FlashDealsPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    location: "",
    distance: [5],
    priceRange: [0, 1000],
    discountRange: [0, 100],
    rating: 0,
    types: [],
  })

  const [flashDealsTime, setFlashDealsTime] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 5, 
    minutes: 23, 
    seconds: 45 
  })
  const [showClaimPopup, setShowClaimPopup] = useState<boolean>(false)
  const [selectedOffer, setSelectedOffer] = useState<FlashDeal | null>(null)
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  // Flash deals countdown
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

  const handleClaimOffer = (offer: FlashDeal) => {
    setSelectedOffer(offer)
    setShowClaimPopup(true)
  }

  // Flash deals data - 14 products for pagination
  const allFlashDeals: FlashDeal[] = [
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
      expiryDate: "2024-12-31",
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
    {
      id: "4",
      title: "Premium Italian Dinner",
      subtitle: "Bella Vista Restaurant",
      image: "/placeholder.svg?height=200&width=300&text=Italian+Restaurant",
      location: t('salmiya'),
      rating: 4.6,
      reviewCount: 187,
      originalPrice: "65 KD",
      discountedPrice: "26 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 10,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "5",
      title: "Luxury Car Wash Package",
      subtitle: "Elite Auto Care",
      image: "/placeholder.svg?height=200&width=300&text=Car+Wash",
      location: t('hawalli'),
      rating: 4.5,
      reviewCount: 98,
      originalPrice: "30 KD",
      discountedPrice: "12 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 45,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "6",
      title: "Professional Hair Styling",
      subtitle: "Glamour Salon",
      image: "/placeholder.svg?height=200&width=300&text=Hair+Salon",
      location: t('farwaniya'),
      rating: 4.8,
      reviewCount: 145,
      originalPrice: "80 KD",
      discountedPrice: "32 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 15,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "7",
      title: "Fitness Bootcamp Sessions",
      subtitle: "Power Gym Club",
      image: "/placeholder.svg?height=200&width=300&text=Fitness+Gym",
      location: t('kuwait_city'),
      rating: 4.4,
      reviewCount: 76,
      originalPrice: "90 KD",
      discountedPrice: "36 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 20,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "8",
      title: "Gourmet Sushi Experience",
      subtitle: "Tokyo Sushi Bar",
      image: "/placeholder.svg?height=200&width=300&text=Sushi+Bar",
      location: t('salmiya'),
      rating: 4.9,
      reviewCount: 203,
      originalPrice: "75 KD",
      discountedPrice: "30 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 60,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "9",
      title: "Electronics Mega Sale",
      subtitle: "Tech World Store",
      image: "/placeholder.svg?height=200&width=300&text=Electronics",
      location: t('avenues_mall'),
      rating: 4.3,
      reviewCount: 134,
      originalPrice: "500 KD",
      discountedPrice: "200 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 40,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "10",
      title: "Luxury Spa Day Package",
      subtitle: "Serenity Wellness Center",
      image: "/placeholder.svg?height=200&width=300&text=Wellness+Spa",
      location: t('kuwait_city'),
      rating: 4.7,
      reviewCount: 167,
      originalPrice: "150 KD",
      discountedPrice: "60 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 25,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "11",
      title: "Adventure Desert Safari",
      subtitle: "Desert Explorer Tours",
      image: "/placeholder.svg?height=200&width=300&text=Desert+Safari",
      location: "Outskirts Kuwait",
      rating: 4.6,
      reviewCount: 89,
      originalPrice: "100 KD",
      discountedPrice: "40 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 50,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "12",
      title: "Photography Session Deal",
      subtitle: "Creative Lens Studio",
      image: "/placeholder.svg?height=200&width=300&text=Photography",
      location: t('hawalli'),
      rating: 4.8,
      reviewCount: 112,
      originalPrice: "120 KD",
      discountedPrice: "48 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 35,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "13",
      title: "Home Cleaning Service",
      subtitle: "Sparkle Clean Co",
      image: "/placeholder.svg?height=200&width=300&text=Cleaning+Service",
      location: t('farwaniya'),
      rating: 4.4,
      reviewCount: 78,
      originalPrice: "50 KD",
      discountedPrice: "20 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes + 10,
      timerSeconds: flashDealsTime.seconds,
    },
    {
      id: "14",
      title: "Artisan Coffee Masterclass",
      subtitle: "Bean & Brew Academy",
      image: "/placeholder.svg?height=200&width=300&text=Coffee+Class",
      location: t('salmiya'),
      rating: 4.9,
      reviewCount: 156,
      originalPrice: "85 KD",
      discountedPrice: "34 KD",
      discountPercentage: 60,
      expiryDate: "2024-12-31",
      timerMinutes: flashDealsTime.hours * 60 + flashDealsTime.minutes - 15,
      timerSeconds: flashDealsTime.seconds,
    },
  ]

  const itemsPerPage = 9
  const totalPages = Math.ceil(allFlashDeals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFlashDeals = allFlashDeals.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

            {/* Flash Deals Header */}
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

              {/* Flash Deals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center mb-12">
                {currentFlashDeals.map((deal) => (
                  <FlashCard
                    key={deal.id}
                    {...deal}
                    isResponsive={true}
                    className="hover:scale-105 transition-transform duration-300 mx-auto w-full max-w-md"
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mb-5">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
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
    </div>
  )
}