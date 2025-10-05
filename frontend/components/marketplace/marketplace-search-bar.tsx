"use client"

import * as React from "react"
import { Search, MapPin, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { MarketplaceProductCard } from "@/components/marketplace/marketplace-product-card"
import { MarketplaceServiceCard } from "@/components/marketplace/marketplace-service-card"

// ==================
// TextField Component
// ==================
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  status?: string
  icon?: React.ReactNode
  error?: boolean
  containerClassName?: string
  onClear?: () => void
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, status, icon, error, className, containerClassName, onClear, ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && <label className="mb-1 text-sm font-medium text-foreground">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-[100px] border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "transition-colors duration-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
              error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
              icon && "pl-10",
              onClear && "pr-10",
              className,
            )}
            {...props}
          />
          {onClear && props.value && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {status && <p className={cn("mt-1 text-xs", error ? "text-destructive" : "text-muted-foreground")}>{status}</p>}
      </div>
    )
  },
)

TextField.displayName = "TextField"

// ==================
// LocationDialog Component
// ==================
interface LocationDialogProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: any) => void
}

const LocationDialog: React.FC<LocationDialogProps> = ({ isOpen, onClose, onLocationSelect }) => {
  const t = useTranslations("marketplace.search")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)

  const dialogRef = React.useRef<HTMLDivElement>(null)

  // Kuwait locations
  const kuwaitLocations = [
    { name: t("locations.kuwaitCity"), area: t("areas.capital"), value: "kuwait-city" },
    { name: t("locations.hawalli"), area: t("areas.hawalli"), value: "hawalli" },
    { name: t("locations.salmiya"), area: t("areas.hawalli"), value: "salmiya" },
    { name: t("locations.ahmadi"), area: t("areas.ahmadi"), value: "ahmadi" },
    { name: t("locations.jahra"), area: t("areas.jahra"), value: "jahra" },
  ]

  const filteredLocations = kuwaitLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.area.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            name: t("currentLocation"),
            area: t("gps"),
            value: "current",
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert(t("locationError"))
        },
      )
    } else {
      alert(t("geoNotSupported"))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className="relative bg-background rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("selectLocation")}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 sm:p-4 border-b border-border">
          <TextField
            placeholder={t("searchLocations")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          <ul>
            {/* Current Location */}
            <li>
              <button
                className={cn(
                  "w-full flex items-center gap-3 p-3 sm:p-4 text-left transition-colors",
                  highlightedIndex === 0 ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                )}
                onClick={handleCurrentLocation}
                onMouseEnter={() => setHighlightedIndex(0)}
              >
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">{t("useCurrentLocation")}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{t("getLocationAutomatically")}</div>
                </div>
              </button>
            </li>

            {/* Locations */}
            {filteredLocations.map((location, index) => (
              <li key={location.value}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 p-3 sm:p-4 text-left transition-colors",
                    highlightedIndex === index + 1
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/10 hover:text-primary",
                  )}
                  onClick={() => onLocationSelect(location)}
                  onMouseEnter={() => setHighlightedIndex(index + 1)}
                >
                  <MapPin size={18} className="text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">{location.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">{location.area}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ==================
// MarketplaceSearchBar Component
// ==================
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

interface MarketplaceSearchBarProps {
  onSearch?: (data: { query: string; type: string; location: any }) => void
  onLocationChange?: (location: any) => void
  className?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  products: Product[]
  services: Service[]
}

const MarketplaceSearchBar: React.FC<MarketplaceSearchBarProps> = ({
  onSearch,
  onLocationChange,
  className,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  products,
  services,
}) => {
  const t = useTranslations("marketplace.search")
  const [isTypeOpen, setIsTypeOpen] = React.useState(false)
  const [isLocationOpen, setIsLocationOpen] = React.useState(false)
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const typeRef = React.useRef<HTMLDivElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLDivElement>(null)

  const types = [
    { value: "all", label: t("types.all") },
    { value: "products", label: t("types.products") },
    { value: "services", label: t("types.services") },
  ]

  // Close type dropdown and suggestions on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false)
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault()
    if (onSearch) {
      onSearch({
        query: searchQuery,
        type: selectedType,
        location: selectedLocation,
      })
    }
    setShowSuggestions(false)
  }

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location)
    setIsLocationOpen(false)
    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    // Trigger search with empty query
    if (onSearch) {
      onSearch({
        query: "",
        type: selectedType,
        location: selectedLocation,
      })
    }
  }

  const filterItems = () => {
    if (!searchQuery) return [];
    const filteredProducts = products.filter((product) => {
      if (
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (selectedType === "services") return false
      if (selectedLocation && product.location !== selectedLocation.value) return false
      return true
    })

    const filteredServices = services.filter((service) => {
      if (
        !service.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (selectedType === "products") return false
      if (selectedLocation && service.location !== selectedLocation.value) return false
      return true
    })

    return selectedType === "products" ? filteredProducts : selectedType === "services" ? filteredServices : [...filteredProducts, ...filteredServices]
  }

  const filteredItems = filterItems()
  const selectedTypeLabel = types.find((type) => type.value === selectedType)?.label || t("types.all")

  return (
    <>
      <div className={cn("relative w-full max-w-2xl mx-auto px-2 sm:px-4 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl", className)}>
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex gap-2">
            {/* Type Dropdown - Fixed styling for mobile */}
            <div className="relative flex-1" ref={typeRef}>
              <button
                type="button"
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="flex items-center justify-center bg-white border-2 border-primary gap-1 h-[40px] px-4 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-[100px] w-full shadow-sm"
              >
                <span className="truncate">{selectedTypeLabel}</span>
                <ChevronDown
                  size={16}
                  className={cn("transition-transform flex-shrink-0", isTypeOpen && "rotate-180")}
                />
              </button>

              {isTypeOpen && (
                <div className="absolute left-0 top-[100%] mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  <ul>
                    {types.map((type) => (
                      <li key={type.value}>
                        <button
                          onClick={() => {
                            const newType = type.value
                            setSelectedType(newType)
                            setIsTypeOpen(false)
                            if (onSearch) {
                              onSearch({
                                query: searchQuery,
                                type: newType,
                                location: selectedLocation,
                              })
                            }
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 text-sm transition-colors",
                            selectedType === type.value
                              ? "bg-primary text-white font-medium"
                              : "hover:bg-primary/10 hover:text-primary text-gray-700",
                          )}
                        >
                          {type.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Location Button - Fixed styling for mobile */}
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center justify-center gap-2 px-4 h-[40px] text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors border border-gray-300 rounded-[100px] min-w-[120px] shadow-sm"
              title={t("selectLocation")}
            >
              <MapPin size={16} className="flex-shrink-0 text-primary" />
              <span className="truncate max-w-[80px] font-medium">
                {selectedLocation ? selectedLocation.name : t("location")}
              </span>
            </button>
          </div>

          {/* Search Input with Suggestions */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center h-[44px] bg-white border-2 border-gray-200 rounded-[100px] hover:border-primary hover:shadow-md transition-all duration-200 shadow-sm">
              <TextField
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e)
                  }
                }}
                placeholder={t("searchPlaceholder")}
                icon={<Search size={18} className="text-primary" />}
                onClear={clearSearch}
                className="w-full h-full pl-14 pr-4 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none rounded-[100px] border-none"
              />
            </div>
            {showSuggestions && filteredItems.length > 0 && (
              <div ref={suggestionsRef} className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                <ul>
                  {filteredItems.map((item) => (
                    <li key={`${selectedType}-${item.id}`}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary transition-colors text-sm flex items-center text-gray-700"
                        onClick={() => {
                          setSearchQuery(item.name)
                          setShowSuggestions(false)
                          handleSearch()
                        }}
                      >
                        <img src={item.image} alt={item.name} className="w-8 h-8 mr-3 rounded object-cover" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Keep existing styling */}
        <div className="hidden sm:block">
          <div className="relative flex items-center h-[45px] lg:h-[50px] bg-background border border-grey-4 rounded-[100px] hover:shadow-md transition-shadow">
            {/* Type Dropdown */}
            <div className="relative" ref={typeRef}>
              <button
                type="button"
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="flex items-center bg-primary/20 gap-2 h-[32px] lg:h-[36px] px-4 lg:px-5 text-sm text-primary ml-3 lg:ml-5 mr-2 lg:mr-3 hover:bg-primary/40 transition-colors border-r border-border rounded-[100px]"
              >
                {selectedTypeLabel}
                <ChevronDown
                  size={16}
                  className={cn("text-primary transition-transform", isTypeOpen && "rotate-180")}
                />
              </button>

              {isTypeOpen && (
                <div className="absolute left-0 top-[100%] mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                  <ul>
                    {types.map((type) => (
                      <li key={type.value}>
                        <button
                          onClick={() => {
                            const newType = type.value
                            setSelectedType(newType)
                            setIsTypeOpen(false)
                            if (onSearch) {
                              onSearch({
                                query: searchQuery,
                                type: newType,
                                location: selectedLocation,
                              })
                            }
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors",
                            selectedType === type.value
                              ? "bg-primary text-white font-medium"
                              : "hover:bg-primary hover:text-white",
                          )}
                        >
                          {type.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Search Input with Suggestions */}
            <div className="flex-1 relative" ref={searchRef}>
              <TextField
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e)
                  }
                }}
                placeholder={t("searchPlaceholder")}
                icon={<Search size={14} />}
                onClear={clearSearch}
                className="w-full h-full pl-10 lg:pl-12 pr-3 lg:pr-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {showSuggestions && filteredItems.length > 0 && (
                <div ref={suggestionsRef} className="absolute left-0 top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <ul>
                    {filteredItems.map((item) => (
                      <li key={`${selectedType}-${item.id}`}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors text-sm flex items-center"
                          onClick={() => {
                            setSearchQuery(item.name)
                            setShowSuggestions(false)
                            handleSearch()
                          }}
                        >
                          <img src={item.image} alt={item.name} className="w-6 h-6 mr-2 rounded" />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Location Button */}
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center gap-2 px-3 lg:px-4 h-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title={t("selectLocation")}
            >
              <MapPin size={14} />
              <span className="hidden md:inline truncate max-w-[80px] lg:max-w-24">
                {selectedLocation ? selectedLocation.name : t("location")}
              </span>
            </button>
          </div>
        </div>
      </div>

      <LocationDialog
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </>
  )
}

export { MarketplaceSearchBar }