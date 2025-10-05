"use client"

import * as React from "react"
import { Search, MapPin, ChevronDown, X, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// ==================
// TextField Component
// ==================
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  status?: string
  icon?: React.ReactNode
  error?: boolean
  containerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, status, icon, error, className, containerClassName, ...props }, ref) => {
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
              className,
            )}
            {...props}
          />
        </div>
        {status && <p className={cn("mt-1 text-xs", error ? "text-destructive" : "text-muted-foreground")}>{status}</p>}
      </div>
    )
  }
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
  const t = useTranslations("SearchBar")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)

  const dialogRef = React.useRef<HTMLDivElement>(null)

  // Example: These will come from API later
  const kuwaitLocations = [
    { name: t("locations.kuwaitCity"), area: t("areas.capital") },
    { name: t("locations.hawalli"), area: t("areas.hawalli") },
    { name: t("locations.salmiya"), area: t("areas.hawalli") },
    { name: t("locations.ahmadi"), area: t("areas.ahmadi") },
    { name: t("locations.jahra"), area: t("areas.jahra") },
  ]

  const filteredLocations = kuwaitLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.area.toLowerCase().includes(searchTerm.toLowerCase())
  )

  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  // close when clicking outside
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
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert(t("locationError"))
        }
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
          {/* Current Location */}
          <button
            className={cn(
              "w-full flex items-center gap-3 p-3 sm:p-4 text-left transition-colors",
              highlightedIndex === 0
                ? "bg-primary/10 text-primary"
                : "hover:bg-primary/10 hover:text-primary"
            )}
            onClick={handleCurrentLocation}
            onMouseEnter={() => setHighlightedIndex(0)}
          >
            <Navigation size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-sm sm:text-base">{t("useCurrentLocation")}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{t("getLocationAutomatically")}</div>
            </div>
          </button>

          {/* Locations */}
          {filteredLocations.map((location, index) => (
            <button
              key={location.name}
              className={cn(
                "w-full flex items-center gap-3 p-3 sm:p-4 text-left transition-colors",
                highlightedIndex === index + 1
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/10 hover:text-primary"
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
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================
// SearchBar Component
// ==================
interface SearchBarProps {
  onSearch?: (data: any) => void
  onLocationChange?: (location: any) => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationChange, className }) => {
  const t = useTranslations("SearchBar")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
  const [isLocationOpen, setIsLocationOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null)

  const categoryRef = React.useRef<HTMLDivElement>(null)

  // Example categories (later: API)
  const categories = [
    { value: "all", label: t("categories.all") },
    { value: "restaurants", label: t("categories.restaurants") },
    { value: "attractions", label: t("categories.attractions") },
    { value: "hotels", label: t("categories.hotels") },
    { value: "shopping", label: t("categories.shopping") },
  ]

  // close category dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({
        query: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
      })
    }
  }

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location)
    setIsLocationOpen(false)
    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  const selectedCategoryLabel = categories.find((cat) => cat.value === selectedCategory)?.label || t("categories.all")

  return (
    <>
      <div className={cn("relative w-full max-w-2xl mx-auto px-2 sm:px-4", className)}>
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-2">
          <div className="flex gap-2">
            {/* Category */}
            <div className="relative flex-1" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-center bg-primary/20 gap-1 h-[36px] px-3 text-xs font-medium text-primary hover:bg-primary/40 transition-colors rounded-[100px] w-full"
              >
                <span className="truncate">{selectedCategoryLabel}</span>
                <ChevronDown size={14} className={cn("text-primary transition-transform flex-shrink-0", isCategoryOpen && "rotate-180")} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-[100%] mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value)
                        setIsCategoryOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs transition-colors",
                        selectedCategory === cat.value
                          ? "bg-primary text-white font-medium"
                          : "hover:bg-primary hover:text-white"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center justify-center gap-1 px-3 h-[36px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-input rounded-[100px] min-w-[80px]"
              title={t("selectLocation")}
            >
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate max-w-[60px]">
                {selectedLocation ? selectedLocation.name : t("location")}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center h-[40px] bg-background border border-input rounded-[100px] hover:shadow-md transition-shadow">
              <Search size={14} className="absolute left-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e)
                }}
                placeholder={t("searchPlaceholder")}
                className="w-full h-full pl-12 pr-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none rounded-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="relative flex items-center h-[45px] lg:h-[50px] bg-background border border-grey-4 rounded-[100px] hover:shadow-md transition-shadow">
            {/* Category */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center bg-primary/20 gap-2 h-[32px] lg:h-[36px] px-4 lg:px-5 text-sm text-primary ml-3 lg:ml-5 mr-2 lg:mr-3 hover:bg-primary/40 transition-colors border-r border-border rounded-[100px]"
              >
                {selectedCategoryLabel}
                <ChevronDown size={16} className={cn("text-primary transition-transform", isCategoryOpen && "rotate-180")} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-[100%] mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value)
                        setIsCategoryOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors",
                        selectedCategory === cat.value
                          ? "bg-primary text-white font-medium"
                          : "hover:bg-primary hover:text-white"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e)
                }}
                placeholder={t("searchPlaceholder")}
                className="w-full h-full pl-10 lg:pl-12 pr-3 lg:pr-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Location */}
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

export { SearchBar }