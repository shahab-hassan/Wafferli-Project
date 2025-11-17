"use client";

import { MapPin, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  suggestions: any[];
  showSuggestions: boolean;
  onSuggestionSelect: (suggestion: any) => void;
  onHideSuggestions: () => void;
}

export function HeroSection({
  searchQuery,
  setSearchQuery,
  onSearch,
  suggestions,
  showSuggestions,
  onSuggestionSelect,
  onHideSuggestions,
}: HeroSectionProps) {
  const [userLocation, setUserLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Eventpage.hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onHideSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onHideSuggestions]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  // Function to get location name from coordinates (reverse geocoding)
  const getLocationName = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      // Return the most specific location name available
      if (data.locality) {
        return data.locality;
      } else if (data.city) {
        return data.city;
      } else if (data.principalSubdivision) {
        return data.principalSubdivision;
      } else if (data.countryName) {
        return data.countryName;
      } else {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.error("Error getting location name:", error);
      // Fallback to coordinates if reverse geocoding fails
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleLocationSearch = async () => {
    // Reset previous errors
    setLocationError("");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorText = "Geolocation is not supported by this browser";
      setLocationError(errorText);
      return;
    }

    // Check if we're in a secure context (HTTPS)
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      const errorText =
        "HTTPS is required for location access. Please use a secure connection.";
      setLocationError(errorText);
      return;
    }

    // Check permissions API if available
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (permissionStatus.state === "denied") {
          setLocationError(
            "Location access is blocked. Please enable it in your browser settings."
          );
          return;
        }
      } catch (e) {
        // Permissions API not fully supported, continue anyway
        console.log("Permissions API not available");
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Get location name from coordinates
          const locationName = await getLocationName(latitude, longitude);

          // Display actual location name in search bar
          setUserLocation(locationName);
          setSearchQuery(locationName);
          onSearch();
        } catch (error) {
          console.error("Error getting location name:", error);
          // Fallback to coordinates
          const locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`;
          setUserLocation(locationText);
          setSearchQuery(locationText);
          onSearch();
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Failed to get your location";
        let helpText = "";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied.";
            helpText =
              "Please click the location icon in your browser's address bar and allow access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            helpText =
              "Please ensure location services are enabled in your device settings and try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            helpText = "Please check your internet connection and try again.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            helpText = "Please try again or search manually.";
            break;
        }

        setLocationError(`${errorMessage} ${helpText}`);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="w-screen  mb-8 bg-red-900 "
    >
      {/* Gradient background with rounded corners */}
      <div
        className="relative w-full"
        style={{
          background: "linear-gradient(135deg, #762c85 0%, #e71e86 100%)",
        }}
      >
        {/* Content */}
        <div className="relative z-10 px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-16 lg:py-20">
          {/* Badge */}
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/10 px-4 py-1.5 text-white/95 backdrop-blur-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">{t("badge")}</span>
          </div>

          {/* Heading */}
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
          >
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-[#fecd07]">{chunks}</span>
              ),
            })}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/90 sm:text-lg">
            {t("subtitle")}
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 w-full max-w-2xl">
            <div className="relative">
              <label htmlFor="hero-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <div className="relative">
                {/* Icon flips position in RTL */}
                <Search
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-black/50 ${
                    isRTL ? "right-4" : "left-4"
                  }`}
                  aria-hidden="true"
                />
                <input
                  id="hero-search"
                  name="q"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("searchPlaceholder")}
                  className={`w-full rounded-full border-0 bg-white/95 ${
                    isRTL ? "pr-11 pl-14" : "pl-11 pr-14"
                  } py-3 text-sm sm:text-base text-black placeholder:text-black/50 shadow-lg outline-none focus:ring-2 focus:ring-white/60`}
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white/60 ${
                    isRTL ? "left-1.5" : "right-1.5"
                  }`}
                  aria-label={t("useLocation")}
                  title={t("useLocation")}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg mt-2 z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => onSuggestionSelect(suggestion)}
                    >
                      <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {suggestion.name ||
                            suggestion.title ||
                            suggestion._id}
                        </div>
                        {suggestion.category && (
                          <div className="text-sm text-gray-500 truncate">
                            {suggestion.category}
                          </div>
                        )}
                        {suggestion.eventDate && (
                          <div className="text-sm text-gray-500 truncate">
                            {new Date(
                              suggestion.eventDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Error */}
            {locationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {locationError}
              </div>
            )}
          </div>
        </div>

        {/* Decorative trees */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[120px] sm:h-[140px] md:h-[160px]">
          {/* Left trees */}
          <img
            src="/trees-event-page.png"
            alt={t("treesAlt")}
            className="absolute bottom-0 left-[-28px] w-auto sm:left-[-36px] h-[160px] md:left-[-48px] md:h-[260px]"
          />
          {/* Right trees */}
          <img
            src="/trees-event-page.png"
            alt={t("treesAlt")}
            className="absolute bottom-0 right-[-28px] w-auto -scale-x-100 sm:right-[-36px] h-[160px] md:right-[-48px] md:h-[260px]"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
