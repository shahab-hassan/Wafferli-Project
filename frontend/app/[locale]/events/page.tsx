"use client"
import { useState, useEffect } from "react"
import { Filter, X, ArrowUp } from "lucide-react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Dropdown, type DropdownOption } from "@/components/common/dropdown"
import { EventCard } from "@/components/event-page/event-card"
import { HeroSection } from "@/components/event-page/hero-section" // Assuming HeroSection can be reused; update path if needed
import EventFilterSidebar from "@/components/event-page/filter-sidebar"
import { Pagination } from "@/components/common/pagination"
import { useMediaQuery } from "react-responsive"
import { useTranslations } from "next-intl"

interface ActiveFilters {
  eventType: string
  location: string
  distance: number[]
  rating: number
  types: string[]
}

interface Event {
  id: string
  name: string
  eventType: string
  image: string
  location: string
  rating: number
  reviewCount: number
  distance: string
  description: string
  isOpen?: boolean
  openHours?: string
  badge?: "trending" | "sponsored" | "popular" | null
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
        {isDesktop ? t("events.filters") : ""}
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

  const sortOptions: DropdownOption[] = [
    { value: "newest", label: t("events.sortOptions.newest_first") },
    { value: "rating", label: t("events.sortOptions.rating_high_low") },
    { value: "distance", label: t("events.sortOptions.nearest") },
    { value: "popular", label: t("events.sortOptions.most_popular") },
    { value: "trending", label: t("events.sortOptions.trending") },
  ]

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">{t("events.sections.all_events")}</h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="min-w-[200px]">
          <Dropdown
            placeholder={t("events.sortOptions.newest_first")}
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

export default function EventsPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    eventType: "",
    location: "",
    distance: [5],
    rating: 0,
    types: [],
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFilter = (type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "types") {
        const types = prev.types.includes(value) ? prev.types.filter((t) => t !== value) : [...prev.types, value]
        return { ...prev, types }
      }
      if (type === "eventType") {
        return { ...prev, eventType: value }
      }
      return { ...prev, [type]: value }
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({
      eventType: "",
      location: "",
      distance: [5],
      rating: 0,
      types: [],
    })
  }

  const getActiveFilterCount = (): number => {
    return (
      activeFilters.types.length +
      (activeFilters.location ? 1 : 0) +
      (activeFilters.eventType ? 1 : 0) +
      (activeFilters.rating > 0 ? 1 : 0)
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const allEvents: Event[] = [
    {
      id: "1",
      name: t("events.events.kuwait_music_festival"),
      eventType: t("events.types.festival"),
      image: "/kuwait-music-festival.jpg",
      location: t("events.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      description: t("events.descriptions.kuwait_music_festival"),
      isOpen: true,
      openHours: "9:00 AM - 10:00 PM",
      badge: "trending",
    },
    {
      id: "2",
      name: t("events.events.business_conference"),
      eventType: t("events.types.conference"),
      image: "/business-conference-kuwait.jpg",
      location: t("events.kuwait_city"),
      rating: 4.4,
      reviewCount: 568,
      distance: "1.8 km",
      description: t("events.descriptions.business_conference"),
      isOpen: true,
      openHours: "8:00 AM - 12:00 AM",
      badge: "sponsored",
    },
    {
      id: "3",
      name: t("events.events.art_exhibition"),
      eventType: t("events.types.art_exhibition"),
      image: "/art-exhibition-kuwait.jpg",
      location: t("events.salmiya"),
      rating: 4.3,
      reviewCount: 234,
      distance: "6.7 km",
      description: t("events.descriptions.art_exhibition"),
      isOpen: true,
      openHours: "24 hours",
      badge: "popular",
    },
    {
      id: "4",
      name: t("events.events.sports_tournament"),
      eventType: t("events.types.sports"),
      image: "/sports-tournament-kuwait.jpg",
      location: t("events.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      description: t("events.descriptions.sports_tournament"),
      isOpen: true,
      openHours: "8:00 AM - 11:00 PM",
      badge: "trending",
    },
    {
      id: "5",
      name: t("events.events.tech_workshop"),
      eventType: t("events.types.workshop"),
      image: "/tech-workshop-kuwait.jpg",
      location: t("events.hawalli"),
      rating: 4.6,
      reviewCount: 423,
      distance: "5.1 km",
      description: t("events.descriptions.tech_workshop"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: null,
    },
    {
      id: "6",
      name: t("events.events.theater_play"),
      eventType: t("events.types.theater"),
      image: "/theater-play-kuwait.jpg",
      location: t("events.kuwait_city"),
      rating: 4.8,
      reviewCount: 423,
      distance: "3.8 km",
      description: t("events.descriptions.theater_play"),
      isOpen: true,
      openHours: "6:00 AM - 12:00 AM",
      badge: null,
    },
    {
      id: "7",
      name: t("events.events.cultural_festival"),
      eventType: t("events.types.festival"),
      image: "/cultural-festival-kuwait.jpg",
      location: t("events.kuwait_city"),
      rating: 4.9,
      reviewCount: 423,
      distance: "3.2 km",
      description: t("events.descriptions.cultural_festival"),
      isOpen: true,
      openHours: "5:00 AM - 11:00 PM",
      badge: null,
    },
    {
      id: "8",
      name: t("events.events.concert_night"),
      eventType: t("events.types.concert"),
      image: "/concert-night-kuwait.jpg",
      location: t("events.farwaniya"),
      rating: 4.5,
      reviewCount: 423,
      distance: "7.3 km",
      description: t("events.descriptions.concert_night"),
      isOpen: true,
      openHours: "10:00 AM - 12:00 AM",
      badge: "sponsored",
    },
    {
      id: "9",
      name: t("events.events.art_workshop"),
      eventType: t("events.types.workshop"),
      image: "/art-workshop-kuwait.jpg",
      location: t("events.ahmadi"),
      rating: 4.7,
      reviewCount: 312,
      distance: "8.5 km",
      description: t("events.descriptions.art_workshop"),
      isOpen: true,
      openHours: "9:00 AM - 6:00 PM",
      badge: "popular",
    },
    {
      id: "10",
      name: t("events.events.business_summit"),
      eventType: t("events.types.conference"),
      image: "/business-summit-kuwait.jpg",
      location: t("events.jahra"),
      rating: 4.2,
      reviewCount: 189,
      distance: "12.1 km",
      description: t("events.descriptions.business_summit"),
      isOpen: true,
      openHours: "8:00 AM - 5:00 PM",
      badge: null,
    },
  ]

  const itemsPerPage = 6
  const totalPages = Math.ceil(allEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEvents = allEvents.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
              <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <EventFilterSidebar
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
            {(activeFilters.types.length > 0 || activeFilters.eventType) && (
              <div className="flex flex-wrap gap-3 mb-8">
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
                {activeFilters.eventType && (
                  <Badge
                    className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    <span>{activeFilters.eventType}</span>
                    <button onClick={() => toggleFilter("eventType", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  {t("events.clear_all")}
                </Button>
              </div>
            )}
            <SortAndViewOptions sortBy={sortBy} setSortBy={setSortBy} />
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {currentEvents.map((event) => (
                  <EventCard category={""} key={event.id} {...event} isResponsive={true} className="w-full max-w-md mx-auto" />
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