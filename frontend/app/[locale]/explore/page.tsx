"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter, X, ArrowUp, Flame } from "lucide-react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Dropdown, type DropdownOption } from "@/components/common/dropdown"
import { ExploreCard } from "@/components/explore/explore-card"
import { HeroSection } from "@/components/explore/hero-section"
import FilterSidebar from "@/components/explore/filter-sidebar"
import { Pagination } from "@/components/common/pagination"
import { useMediaQuery } from "react-responsive"
import { useTranslations } from "next-intl"

interface ActiveFilters {
  categories: string[]
  location: string
  distance: number[]
  rating: number
  types: string[]
}

interface Place {
  id: string
  name: string
  category: string
  image: string
  location: string
  rating: number
  reviewCount: number
  distance: string
  description: string
  isOpen?: boolean
  openHours?: string
  badge?: "trending" | "sponsored" | "popular" | null
  // Add coordinates for map directions
  coordinates?: {
    lat: number
    lng: number
  }
}

interface SearchAndFilterSectionProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  getActiveFilterCount: () => number
}

interface SortAndViewOptionsProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

function SearchAndFilterSection({ showFilters, setShowFilters, getActiveFilterCount }: SearchAndFilterSectionProps) {
  const t = useTranslations()
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })

  return (
    <div className="flex flex-row gap-4 items-center mb-10">
      <Button
        variant="normal"
        onClick={() => setShowFilters(!showFilters)}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-8 py-3 sm:py-5 relative text-white font-medium shrink-0"
      >
        <Filter className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
        {isDesktop ? t("explore.filters") : ""}
        {getActiveFilterCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>
    </div>
  )
}

function SortAndViewOptions({ sortBy, setSortBy }: SortAndViewOptionsProps) {
  const t = useTranslations()

  const sortOptions: DropdownOption[] = useMemo(() => [
    { value: "newest", label: t("explore.sortOptions.newest_first") },
    { value: "rating", label: t("explore.sortOptions.rating_high_low") },
    { value: "distance", label: t("explore.sortOptions.nearest") },
    { value: "popular", label: t("explore.sortOptions.most_popular") },
    { value: "trending", label: t("explore.sortOptions.trending") },
  ], [t])

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">{t("explore.sections.all_places")}</h2>
        <p className="text-normal-regular text-muted-foreground">
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            {t("explore.sections.trending_this_week")}
          </span>
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="min-w-[200px]">
          <Dropdown
            placeholder={t("explore.sortOptions.newest_first")}
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

export default function ExplorePage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  // Initialize activeFilters with URL parameters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const categoryParam = searchParams.get('category')
    return {
      categories: categoryParam ? [categoryParam] : [],
      location: "",
      distance: [5],
      rating: 0,
      types: [],
    }
  })

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && !activeFilters.categories.includes(categoryParam)) {
      setActiveFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }))
    }
  }, [searchParams, activeFilters.categories])

  // Update URL when filters change
  const updateURL = useCallback((filters: ActiveFilters) => {
    const params = new URLSearchParams()
    
    if (filters.categories.length > 0) {
      // For now, just use the first category. You could modify this to support multiple categories
      params.set('category', filters.categories[0])
    }
    
    // Add other filter parameters as needed
    if (filters.location) {
      params.set('location', filters.location)
    }
    if (filters.rating > 0) {
      params.set('rating', filters.rating.toString())
    }
    
    const newUrl = params.toString() ? `/explore?${params.toString()}` : '/explore'
    router.replace(newUrl, { scroll: false })
  }, [router])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFilter = useCallback((type: string, value: any) => {
    setActiveFilters((prev) => {
      let newFilters: ActiveFilters
      
      if (type === "categories") {
        const categories = prev.categories.includes(value)
          ? prev.categories.filter((c) => c !== value)
          : [...prev.categories, value]
        newFilters = { ...prev, categories }
      } else if (type === "types") {
        const types = prev.types.includes(value) ? prev.types.filter((t) => t !== value) : [...prev.types, value]
        newFilters = { ...prev, types }
      } else {
        newFilters = { ...prev, [type]: value }
      }
      
      // Update URL with new filters
      updateURL(newFilters)
      
      return newFilters
    })
  }, [updateURL])

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      categories: [],
      location: "",
      distance: [5],
      rating: 0,
      types: [],
    }
    setActiveFilters(clearedFilters)
    updateURL(clearedFilters)
  }, [updateURL])

  const getActiveFilterCount = useCallback((): number => {
    return (
      activeFilters.categories.length +
      activeFilters.types.length +
      (activeFilters.location ? 1 : 0) +
      (activeFilters.rating > 0 ? 1 : 0)
    )
  }, [activeFilters])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Helper function to get category display name
  const getCategoryDisplayName = useCallback((categoryId: string) => {
    // Map category IDs to their translation keys
    const categoryTranslationMap: { [key: string]: string } = {
      'restaurants': t('CategoriesSection.restaurants'),
      'hotels-stays': t('CategoriesSection.hotels-stays'),
      'salons-spas': t('CategoriesSection.salons-spas'),
      'shopping': t('CategoriesSection.shopping'),
      'entertainment': t('CategoriesSection.entertainment'),
      'services': t('CategoriesSection.services'),
      'weddings': t('CategoriesSection.weddings'),
      'marketplace': t('CategoriesSection.marketplace'),
    }
    
    return categoryTranslationMap[categoryId] || categoryId
  }, [t])

  const trendingPlaces = useMemo<Place[]>(() => [
    {
      id: "1",
      name: t("explore.places.scientific_center"),
      category: t("explore.categories.landmarks"),
      image: "/kuwait-scientific-center.jpg",
      location: t("explore.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      description: t("explore.descriptions.scientific_center"),
      isOpen: true,
      openHours: "9:00 AM - 10:00 PM",
      badge: "trending",
      coordinates: { lat: 29.3759, lng: 48.0036 },
    },
    {
      id: "2",
      name: t("explore.places.souq_al_mubarakiya"),
      category: t("explore.categories.shopping"),
      image: "/souq-al-mubarakiya-kuwait.jpg",
      location: t("explore.kuwait_city"),
      rating: 4.4,
      reviewCount: 568,
      distance: "1.8 km",
      description: t("explore.descriptions.souq_al_mubarakiya"),
      isOpen: true,
      openHours: "8:00 AM - 12:00 AM",
      badge: "trending",
      coordinates: { lat: 29.3759, lng: 47.9774 },
    },
    {
      id: "3",
      name: t("explore.places.marina_beach"),
      category: t("explore.categories.landmarks"),
      image: "/marina-beach-kuwait.jpg",
      location: t("explore.salmiya"),
      rating: 4.3,
      reviewCount: 234,
      distance: "6.7 km",
      description: t("explore.descriptions.marina_beach"),
      isOpen: true,
      openHours: "24 hours",
      badge: "trending",
      coordinates: { lat: 29.3375, lng: 48.0758 },
    },
  ], [t])

  const allPlaces = useMemo<Place[]>(() => [
    {
      id: "4",
      name: t("explore.places.kuwait_towers"),
      category: t("explore.categories.landmarks"),
      image: "/kuwait-towers.jpg",
      location: t("explore.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      description: t("explore.descriptions.kuwait_towers"),
      isOpen: true,
      openHours: "8:00 AM - 11:00 PM",
      badge: "sponsored",
      coordinates: { lat: 29.3759, lng: 47.9774 },
    },
    {
      id: "5",
      name: t("explore.places.the_avenues_mall"),
      category: t("explore.categories.shopping"),
      image: "/avenues-mall-kuwait.jpg",
      location: t("explore.avenues_mall"),
      rating: 4.6,
      reviewCount: 423,
      distance: "5.1 km",
      description: t("explore.descriptions.the_avenues_mall"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: null,
      coordinates: { lat: 29.3117, lng: 47.9067 },
    },
    {
      id: "6",
      name: t("explore.places.al_shaheed_park"),
      category: t("explore.categories.parks"),
      image: "/al-shaheed-park-kuwait.jpg",
      location: t("explore.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "3.8 km",
      description: t("explore.descriptions.al_shaheed_park"),
      isOpen: true,
      openHours: "6:00 AM - 12:00 AM",
      badge: null,
      coordinates: { lat: 29.3651, lng: 47.9763 },
    },
    {
      id: "7",
      name: t("explore.places.grand_mosque"),
      category: t("explore.categories.landmarks"),
      image: "/grand-mosque-kuwait.jpg",
      location: t("explore.kuwait_city"),
      rating: 4.9,
      reviewCount: 423,
      distance: "3.2 km",
      description: t("explore.descriptions.grand_mosque"),
      isOpen: true,
      openHours: "5:00 AM - 11:00 PM",
      badge: null,
      coordinates: { lat: 29.3759, lng: 47.9774 },
    },
    {
      id: "8",
      name: t("explore.places.360_mall"),
      category: t("explore.categories.shopping"),
      image: "/360-mall-kuwait.jpg",
      location: t("explore.al_zahra"),
      rating: 4.5,
      reviewCount: 423,
      distance: "7.3 km",
      description: t("explore.descriptions.360_mall"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: "sponsored",
      coordinates: { lat: 29.3016, lng: 48.0298 },
    },
    {
      id: "9",
      name: t("explore.places.360_mall"),
      category: t("explore.categories.shopping"),
      image: "/360-mall-kuwait.jpg",
      location: t("explore.al_zahra"),
      rating: 4.5,
      reviewCount: 423,
      distance: "7.3 km",
      description: t("explore.descriptions.360_mall"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: "sponsored",
      coordinates: { lat: 29.3016, lng: 48.0298 },
    },
    {
      id: "10",
      name: t("explore.places.360_mall"),
      category: t("explore.categories.shopping"),
      image: "/360-mall-kuwait.jpg",
      location: t("explore.al_zahra"),
      rating: 4.5,
      reviewCount: 423,
      distance: "7.3 km",
      description: t("explore.descriptions.360_mall"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: "sponsored",
      coordinates: { lat: 29.3016, lng: 48.0298 },
    },
    {
      id: "11",
      name: t("explore.places.360_mall"),
      category: t("explore.categories.shopping"),
      image: "/360-mall-kuwait.jpg",
      location: t("explore.al_zahra"),
      rating: 4.5,
      reviewCount: 423,
      distance: "7.3 km",
      description: t("explore.descriptions.360_mall"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: "sponsored",
      coordinates: { lat: 29.3016, lng: 48.0298 },
    },
  ], [t])

  const itemsPerPage = 6
  const totalPages = Math.ceil(allPlaces.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPlaces = allPlaces.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex flex-col lg:flex-row gap-10">
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
          />
          <div className="flex-1">
            <SearchAndFilterSection
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
            {(activeFilters.categories.length > 0 || activeFilters.types.length > 0) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {activeFilters.categories.map((category) => (
                  <Badge
                    key={category}
                    className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    <span>{getCategoryDisplayName(category)}</span>
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
                  {t("explore.clear_all")}
                </Button>
              </div>
            )}
            <SortAndViewOptions sortBy={sortBy} setSortBy={setSortBy} />
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {trendingPlaces.map((place) => (
                  <ExploreCard
                    key={place.id}
                    {...place}
                    isResponsive={true}
                    className="hover:scale-105 transition-transform duration-300 mx-auto w-full max-w-md"
                  />
                ))}
              </div>
            </div>
            <div className="mb-12">
              <h3 className="text-h5 text-foreground font-bold mb-8">{t("explore.sections.all_places")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {currentPlaces.map((place) => (
                  <ExploreCard key={place.id} {...place} isResponsive={true} className="w-full max-w-md mx-auto" />
                ))}
              </div>
            </div>
            <div className="flex justify-center mb-5">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      </div>
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