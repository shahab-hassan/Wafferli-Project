"use client"
import { Search, MapPin } from "lucide-react"
import { TextField } from "@/components/common/text-field"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
  suggestions?: any[]
  showSuggestions?: boolean
  onSuggestionSelect: (suggestion: any) => void
  onHideSuggestions: () => void
}

export function HeroSection({ 
  searchQuery, 
  setSearchQuery, 
  onSearch,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  onHideSuggestions
}: HeroSectionProps) {
  const t = useTranslations()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<string>("")
  const [locationError, setLocationError] = useState<string>("")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onHideSuggestions()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onHideSuggestions])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  // Function to get location name from coordinates (reverse geocoding)
  const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data')
      }
      
      const data = await response.json()
      
      // Return the most specific location name available
      if (data.locality) {
        return data.locality
      } else if (data.city) {
        return data.city
      } else if (data.principalSubdivision) {
        return data.principalSubdivision
      } else if (data.countryName) {
        return data.countryName
      } else {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      }
    } catch (error) {
      console.error('Error getting location name:', error)
      // Fallback to coordinates if reverse geocoding fails
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    }
  }

 const handleLocationSearch = async () => {
    // Reset previous errors
    setLocationError("")
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorText = "Geolocation is not supported by this browser"
      setLocationError(errorText)
      return
    }
    
    // Check if we're in a secure context (HTTPS)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      const errorText = "HTTPS is required for location access. Please use a secure connection."
      setLocationError(errorText)
      return
    }

    // Check permissions API if available
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })
        if (permissionStatus.state === 'denied') {
          setLocationError("Location access is blocked. Please enable it in your browser settings.")
          return
        }
      } catch (e) {
        // Permissions API not fully supported, continue anyway
        console.log("Permissions API not available")
      }
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Get location name from coordinates
          const locationName = await getLocationName(latitude, longitude)
          
          // Display actual location name in search bar
          setUserLocation(locationName)
          setSearchQuery(locationName)
          onSearch()
        } catch (error) {
          console.error("Error getting location name:", error)
          // Fallback to coordinates
          const locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setUserLocation(locationText)
          setSearchQuery(locationText)
          onSearch()
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        let errorMessage = "Failed to get your location"
        let helpText = ""
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied."
            helpText = "Please click the location icon in your browser's address bar and allow access."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            helpText = "Please ensure location services are enabled in your device settings and try again."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            helpText = "Please check your internet connection and try again."
            break
          default:
            errorMessage = "An unknown error occurred."
            helpText = "Please try again or search manually."
            break
        }
        
        setLocationError(`${errorMessage} ${helpText}`)
      },
      {
        enableHighAccuracy: false, // Changed to false for faster response
        timeout: 10000, // Reduced to 10 seconds
        maximumAge: 300000 // Cache for 5 minutes
      }
    )
  }

  return (
    // Break out to full viewport width
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-10">
      <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Top Left - explore1.png */}
          <img
            src="/explore1.png"
            alt="Kuwait Architecture"
            className="absolute -top-8 left-4 w-40 h-32 sm:w-48 sm:h-36 lg:w-56 lg:h-40 rounded-2xl object-cover opacity-90 transform rotate-12 shadow-lg"
          />

          {/* Top Right - explore2.png */}
          <img
            src="/explore2.png"
            alt="Kuwait Towers"
            className="absolute -top-8 right-4 w-36 h-28 sm:w-44 sm:h-32 lg:w-52 lg:h-36 rounded-2xl object-cover opacity-90 transform -rotate-12 shadow-lg"
          />

          {/* Bottom Left - explore3.png */}
          <img
            src="/explore3.png"
            alt="Traditional Kuwait"
            className="absolute -bottom-8 left-4 w-38 h-30 sm:w-46 sm:h-34 lg:w-54 lg:h-38 rounded-2xl object-cover opacity-90 transform -rotate-8 shadow-lg"
          />

          {/* Bottom Right - explore4.png */}
          <img
            src="/explore4.png"
            alt="Kuwait Heritage"
            className="absolute -bottom-8 right-2 w-42 h-34 sm:w-50 sm:h-38 lg:w-58 lg:h-42 rounded-2xl object-cover opacity-90 transform rotate-8 shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center py-16 px-6 sm:py-20 sm:px-8">
          {/* Explore Kuwait Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">{t("explore.hero.badge")}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {t("explore.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-pretty">
            {t("explore.hero.subtitle")}
          </p>

          {/* Search Bar with Suggestions */}
          <div className="relative max-w-2xl mx-auto" ref={suggestionsRef}>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-grey-3 z-10" />
              <TextField
                type="text"
                placeholder={t("explore.hero.searchPlaceholder")}
                className="w-full pl-14 pr-16 py-4 text-normal-regular bg-white rounded-full border-0 shadow-lg focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={handleLocationSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-grey-5 hover:bg-grey-4 transition-colors"
                title="Use my current location"
              >
                <MapPin className="w-4 h-4 text-grey-2" />
              </button>

              {/* Location Error Message */}
              {locationError && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                  {locationError}
                </div>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => onSuggestionSelect(suggestion)}
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">
                          {suggestion.name}
                        </div>
                        {suggestion.category && (
                          <div className="text-sm text-muted-foreground">
                            {suggestion.category}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}