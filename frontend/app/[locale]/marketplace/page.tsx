// marketplace.tsx (modified with slider)

"use client"

import { useState, useEffect, useRef } from "react"
import { Filter, X, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Dropdown, type DropdownOption } from "@/components/common/dropdown"
import { MarketplaceProductCard } from "@/components/marketplace/marketplace-product-card"
import { MarketplaceServiceCard } from "@/components/marketplace/marketplace-service-card"
import { MarketplaceHero } from "@/components/marketplace/marketplace-hero"
import { MarketplaceTabs } from "@/components/marketplace/marketplace-tabs"
import { MarketplaceCategories } from "@/components/marketplace/marketplace-categories"
import { MarketplaceServiceCategories } from "@/components/marketplace/marketplace-service-categories"
import { MarketplaceSubcategories } from "@/components/marketplace/marketplace-subcategories"
import MarketplaceFilterSidebar from "@/components/marketplace/marketplace-filter-sidebar"
import MarketplaceServiceFilterSidebar from "@/components/marketplace/marketplace-service-filter-sidebar"
import { Pagination } from "@/components/common/pagination"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "react-responsive"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useRole } from "@/contexts/roleContext"

interface ActiveFilters {
  location: string
  brands: string[]
  condition: string[]
  priceRange: number[]
  rating: number
}

interface ActiveServiceFilters {
  location: string
  serviceCategories: string[]
  priceRange: number[]
  rating: number
}

interface Product {
  id: string
  name: string
  brand: string
  image: string
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  discount?: number
  description: string
  badge?: "sponsored" | "brand_new" | null
  condition: string
  seller: string
  inStock: boolean
  location: string
  category: string
  subcategory: string
}

interface Service {
  id: string
  name: string
  category: string
  subcategory: string
  image: string
  rating: number
  reviewCount: number
  startingPrice: number
  description: string
  badge?: "sponsored" | null
  seller: string
  location: string
}

interface SearchAndFilterSectionProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  getActiveFilterCount: () => number
}

interface SortAndViewOptionsProps {
  sortBy: string
  setSortBy: (sort: string) => void
  totalProducts: number
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
        {isDesktop ? t("marketplace.filters.title") : ""}
        {getActiveFilterCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>
    </div>
  )
}

function SortAndViewOptions({ sortBy, setSortBy, totalProducts }: SortAndViewOptionsProps) {
  const t = useTranslations()

  const sortOptions: DropdownOption[] = [
    { value: "newest", label: t("marketplace.sortOptions.newestFirst") },
    { value: "rating", label: t("marketplace.sortOptions.ratingHighLow") },
    { value: "price_low", label: t("marketplace.sortOptions.priceLowHigh") },
    { value: "price_high", label: t("marketplace.sortOptions.priceHighLow") },
    { value: "popular", label: t("marketplace.sortOptions.mostPopular") },
  ]

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">{t("marketplace.sections.allElectronics")}</h2>
        <p className="text-normal-regular text-muted-foreground">
          {t("marketplace.sections.showingAds", { count: totalProducts })}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="min-w-[200px]">
          <Dropdown
            placeholder={t("marketplace.sortOptions.newestFirst")}
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

export default function MarketplacePage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { role } = useRole()
  const sliderRef = useRef<HTMLDivElement>(null)
  const initialTab = searchParams.get("tab") === "services" ? "services" : "products"
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [committedSearchQuery, setCommittedSearchQuery] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"products" | "services">(initialTab)
  const [activeCategory, setActiveCategory] = useState<string>("electronics")
  const [activeServiceCategory, setActiveServiceCategory] = useState<string>("professional")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    location: "",
    brands: [],
    condition: [],
    priceRange: [240, 2000],
    rating: 0,
  })
  const [activeServiceFilters, setActiveServiceFilters] = useState<ActiveServiceFilters>({
    location: "",
    serviceCategories: [],
    priceRange: [15, 500],
    rating: 0,
  })

  const products: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "/iphone-15-pro-max.png",
      rating: 4.6,
      reviewCount: 324,
      price: 450,
      originalPrice: 520,
      discount: 13,
      description: "256GB, Titanium Blue, Unlocked",
      condition: "brand_new",
      seller: "TechZone Kuwait",
      inStock: true,
      badge: "sponsored",
      location: "kuwait-city",
      category: "electronics",
      subcategory: "mobile",
    },
    {
      id: "2",
      name: 'MacBook Pro 16"',
      brand: "Apple",
      image: "/macbook-pro-16-inch.jpg",
      rating: 4.5,
      reviewCount: 189,
      price: 1200,
      originalPrice: 1350,
      discount: 11,
      description: "M3 Pro, 18GB RAM, 512GB SSD",
      condition: "brand_new",
      seller: "Apple Store Kuwait",
      inStock: true,
      badge: "brand_new",
      location: "salmiya",
      category: "electronics",
      subcategory: "laptop",
    },
    {
      id: "3",
      name: 'MacBook Pro 16"',
      brand: "Apple",
      image: "/macbook-pro-16-silver.jpg",
      rating: 4.5,
      reviewCount: 189,
      price: 1200,
      originalPrice: 1350,
      discount: 11,
      description: "M3 Pro, 18GB RAM, 512GB SSD",
      condition: "brand_new",
      seller: "Apple Store Kuwait",
      inStock: true,
      badge: "sponsored",
      location: "hawalli",
      category: "electronics",
      subcategory: "laptop",
    },
    {
      id: "4",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "/iphone-15-pro-max-titanium.png",
      rating: 4.6,
      reviewCount: 324,
      price: 450,
      originalPrice: 520,
      discount: 13,
      description: "256GB, Titanium Blue, Unlocked",
      condition: "brand_new",
      seller: "TechZone Kuwait",
      inStock: true,
      badge: null,
      location: "farwaniya",
      category: "electronics",
      subcategory: "mobile",
    },
    {
      id: "5",
      name: 'MacBook Pro 16"',
      brand: "Apple",
      image: "/macbook-pro-16-space-gray.jpg",
      rating: 4.5,
      reviewCount: 189,
      price: 1200,
      originalPrice: 1350,
      discount: 11,
      description: "M3 Pro, 18GB RAM, 512GB SSD",
      condition: "used_excellent",
      seller: "Apple Store Kuwait",
      inStock: true,
      badge: "sponsored",
      location: "ahmadi",
      category: "electronics",
      subcategory: "laptop",
    },
    {
      id: "6",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "/iphone-15-pro-max-natural-titanium.jpg",
      rating: 4.6,
      reviewCount: 324,
      price: 450,
      originalPrice: 520,
      discount: 13,
      description: "256GB, Titanium Blue, Unlocked",
      condition: "used_good",
      seller: "TechZone Kuwait",
      inStock: true,
      badge: null,
      location: "jahra",
      category: "electronics",
      subcategory: "mobile",
    },
    {
      id: "7",
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      image: "/samsung-galaxy-s24-ultra.png",
      rating: 4.4,
      reviewCount: 256,
      price: 380,
      originalPrice: 420,
      discount: 10,
      description: "512GB, Phantom Black, Unlocked",
      condition: "brand_new",
      seller: "Samsung Store Kuwait",
      inStock: true,
      badge: "brand_new",
      location: "kuwait-city",
      category: "electronics",
      subcategory: "mobile",
    },
    {
      id: "8",
      name: "Sony WH-1000XM5",
      brand: "Sony",
      image: "/sony-wh-1000xm5.png",
      rating: 4.7,
      reviewCount: 189,
      price: 120,
      originalPrice: 150,
      discount: 20,
      description: "Wireless Noise Canceling Headphones",
      condition: "refurbished",
      seller: "Audio Pro Kuwait",
      inStock: true,
      badge: null,
      location: "salmiya",
      category: "electronics",
      subcategory: "accessories",
    },
  ]

  const services: Service[] = [
    {
      id: "10",
      name: "AC Repair & Maintenance",
      category: "home-personal",
      subcategory: "repair",
      image: "/services/ac-repair.jpg",
      rating: 4.6,
      reviewCount: 124,
      startingPrice: 15,
      description: "24/7 emergency AC repair service",
      badge: "sponsored",
      seller: "TechZone Kuwait",
      location: "kuwait-city",
    },
    {
      id: "11",
      name: "House Cleaning Service",
      category: "home-personal",
      subcategory: "cleaning",
      image: "/services/house-cleaning.jpg",
      rating: 4.8,
      reviewCount: 89,
      startingPrice: 25,
      description: "Professional deep cleaning for your home",
      badge: null,
      seller: "Clean Pro Kuwait",
      location: "salmiya",
    },
    {
      id: "12",
      name: "Legal Consultation",
      category: "professional",
      subcategory: "legal",
      image: "/services/legal-consulting.jpg",
      rating: 4.9,
      reviewCount: 156,
      startingPrice: 50,
      description: "Expert legal advice and consultation",
      badge: "sponsored",
      seller: "Kuwait Legal Experts",
      location: "kuwait-city",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab") === "services" ? "services" : "products"
    if (tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)
      return () => {
        slider.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [role])

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 340
      const newScrollLeft =
        direction === "left"
          ? sliderRef.current.scrollLeft - scrollAmount
          : sliderRef.current.scrollLeft + scrollAmount
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const toggleFilter = (type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "brands" || type === "condition") {
        const currentArray = prev[type as keyof Pick<ActiveFilters, "brands" | "condition">]
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value]
        return { ...prev, [type]: newArray }
      }
      return { ...prev, [type]: value }
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({
      location: "",
      brands: [],
      condition: [],
      priceRange: [240, 2000],
      rating: 0,
    })
  }

  const getActiveFilterCount = (): number => {
    return (
      activeFilters.brands.length +
      activeFilters.condition.length +
      (activeFilters.location ? 1 : 0) +
      (activeFilters.rating > 0 ? 1 : 0)
    )
  }

  const toggleServiceFilter = (type: string, value: any) => {
    setActiveServiceFilters((prev) => {
      if (type === "serviceCategories") {
        const currentArray = prev.serviceCategories
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value]
        return { ...prev, [type]: newArray }
      }
      return { ...prev, [type]: value }
    })
  }

  const clearAllServiceFilters = () => {
    setActiveServiceFilters({
      location: "",
      serviceCategories: [],
      priceRange: [15, 500],
      rating: 0,
    })
  }

  const getActiveServiceFilterCount = (): number => {
    return (
      activeServiceFilters.serviceCategories.length +
      (activeServiceFilters.location ? 1 : 0) +
      (activeServiceFilters.rating > 0 ? 1 : 0)
    )
  }

  const handleSearch = (searchData: any) => {
    setCommittedSearchQuery(searchData.query)
    setSelectedType(searchData.type)

    if (searchData.type === "products") {
      setActiveTab("products")
    } else if (searchData.type === "services") {
      setActiveTab("services")
    }
  }

  const handleTabChange = (newTab: "products" | "services") => {
    setActiveTab(newTab)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("tab", newTab)
    router.replace(`${pathname}?${newSearchParams.toString()}`)
  }

  const filterProducts = (products: Product[]): Product[] => {
    return products.filter((product) => {
      if (
        committedSearchQuery &&
        !product.name.toLowerCase().includes(committedSearchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(committedSearchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(committedSearchQuery.toLowerCase())
      ) {
        return false
      }

      if (selectedType === "services") {
        return false
      }

      if (activeCategory !== "all" && product.category !== activeCategory) {
        return false
      }

      if (activeSubcategory !== "all" && product.subcategory !== activeSubcategory) {
        return false
      }

      if (activeFilters.location && product.location && product.location !== activeFilters.location) {
        return false
      }

      if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand.toLowerCase())) {
        return false
      }

      if (activeFilters.condition.length > 0) {
        if (!activeFilters.condition.includes(product.condition)) {
          return false
        }
      }

      if (product.price < activeFilters.priceRange[0] || product.price > activeFilters.priceRange[1]) {
        return false
      }

      if (activeFilters.rating > 0 && product.rating < activeFilters.rating) {
        return false
      }

      return true
    })
  }

  const filterServices = (services: Service[]): Service[] => {
    return services.filter((service) => {
      if (
        committedSearchQuery &&
        !service.name.toLowerCase().includes(committedSearchQuery.toLowerCase()) &&
        !service.description.toLowerCase().includes(committedSearchQuery.toLowerCase())
      ) {
        return false
      }

      if (selectedType === "products") {
        return false
      }

      if (activeServiceCategory !== "all" && !service.category.includes(activeServiceCategory)) {
        return false
      }

      if (
        activeServiceFilters.location && service.location && service.location !== activeServiceFilters.location
      ) {
        return false
      }

      if (
        activeServiceFilters.serviceCategories.length > 0 &&
        !activeServiceFilters.serviceCategories.includes(service.subcategory)
      ) {
        return false
      }

      if (
        service.startingPrice < activeServiceFilters.priceRange[0] ||
        service.startingPrice > activeServiceFilters.priceRange[1]
      ) {
        return false
      }

      if (activeServiceFilters.rating > 0 && service.rating < activeServiceFilters.rating) {
        return false
      }

      return true
    })
  }

  const filteredProducts = filterProducts(products)
  const filteredServices = filterServices(services)
  const currentItems = activeTab === "products" ? filteredProducts : filteredServices
  const itemsPerPage = 6
  const totalPages = Math.ceil(currentItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDisplayItems = currentItems.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters, activeServiceFilters, committedSearchQuery])

  const activeProducts = products.filter((p) => p.inStock)
  const activeServices = services
  const allActive: (Product | Service)[] = [...activeProducts, ...activeServices]

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MarketplaceHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onSearch={handleSearch}
          products={products}
          services={services}
        />

        {role === "seller" && allActive.length > 0 && (
          <div className="mt-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 px-4">{t("marketplace.allAds")}</h2>
            <div className="relative group">
              {canScrollLeft && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}
              
              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {allActive.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-[340px]">
                    {"price" in item ? (
                      <MarketplaceProductCard {...item} className="w-full" />
                    ) : (
                      <MarketplaceServiceCard {...item} className="w-full" />
                    )}
                  </div>
                ))}
              </div>

              {canScrollRight && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        )}

        <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "products" && (
          <>
            <MarketplaceCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <MarketplaceSubcategories
              activeSubcategory={activeSubcategory}
              onSubcategoryChange={setActiveSubcategory}
            />

            <div className="flex flex-col lg:flex-row gap-10">
              <MarketplaceFilterSidebar
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
                {(activeFilters.brands.length > 0 || activeFilters.condition.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {activeFilters.brands.map((brand) => (
                      <Badge
                        key={brand}
                        className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                      >
                        <span>{brand}</span>
                        <button onClick={() => toggleFilter("brands", brand)}>
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                    {activeFilters.condition.map((condition) => (
                      <Badge
                        key={condition}
                        className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                      >
                        <span>{condition}</span>
                        <button onClick={() => toggleFilter("condition", condition)}>
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
                      {t("marketplace.filters.clearAll")}
                    </Button>
                  </div>
                )}
                <SortAndViewOptions sortBy={sortBy} setSortBy={setSortBy} totalProducts={filteredProducts.length} />
                <div className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {currentDisplayItems.map((product) => (
                      <MarketplaceProductCard key={product.id} {...product} className="w-full max-w-md mx-auto" />
                    ))}
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t("marketplace.noProductsFound")}</h3>
                      <p className="text-muted-foreground mb-4">{t("marketplace.tryAdjustingFilters")}</p>
                      <Button
                        variant="outline"
                        onClick={clearAllServiceFilters}
                        className="rounded-full bg-transparent"
                      >
                        {t("marketplace.filters.clearAll")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mb-5">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              </div>
            </div>
          </>
        )}{activeTab === "services" && (
          <>
            <MarketplaceServiceCategories
              activeServiceCategory={activeServiceCategory}
              onServiceCategoryChange={setActiveServiceCategory}
            />

            <div className="flex flex-col lg:flex-row gap-10">
              <MarketplaceServiceFilterSidebar
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                activeFilters={activeServiceFilters}
                toggleFilter={toggleServiceFilter}
                clearAllFilters={clearAllServiceFilters}
                getActiveFilterCount={getActiveServiceFilterCount}
                activeServiceCategory={activeServiceCategory}
              />
              <div className="flex-1">
                <div className="flex flex-row gap-4 items-center mb-10">
                  <Button
                    variant="normal"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-8 py-3 sm:py-5 relative text-white font-medium shrink-0"
                  >
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
                    {t("marketplace.filters.title")}
                    {getActiveServiceFilterCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
                        {getActiveServiceFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </div>

                <div className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {currentDisplayItems.map((service) => (
                      <MarketplaceServiceCard key={service.id} {...service} className="w-full max-w-md mx-auto" />
                    ))}
                  </div>
                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t("marketplace.noProductsFound")}</h3>
                      <p className="text-muted-foreground mb-4">{t("marketplace.tryAdjustingFilters")}</p>
                      <Button
                        variant="outline"
                        onClick={clearAllServiceFilters}
                        className="rounded-full bg-transparent"
                      >
                        {t("marketplace.filters.clearAll")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mb-5">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}