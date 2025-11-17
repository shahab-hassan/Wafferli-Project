// app/offers/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, MapPin, Filter, X, ArrowUp, TrendingUp } from "lucide-react";
import { Button } from "@/components/common/button";
import { TextField } from "@/components/common/text-field";
import { Badge } from "@/components/common/badge";
import { Dropdown, DropdownOption } from "@/components/common/dropdown";
import { OfferCard } from "@/components/cards/offer-card";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { FilterSidebar } from "@/components/filterSidebarProduct";
import OfferPopup from "@/components/common/offer-popup/offer-popup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { GetAllFlashDeal, SearchFlashDeal } from "@/features/slicer/AdSlice";
import { SkeletonCard } from "@/components/common/SkeletonCard";

interface ActiveFilters {
  category?: string;
  offerCat?: string;
  city?: string;
  neighbourhood?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  maxDiscount?: number;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  images: string[];
  city: string;
  neighbourhood: string;
  rating: number;
  reviewsCount: number;
  discountedPrice: number | null;
  originalPrice?: number;
  category: string;
  discountPercentage?: number;
  expiryDate: string;
  badge?: "new_arrival" | "sponsored" | "trending" | "expiring_soon" | null;
  flashDeal: boolean;
  adType: string;
  createdAt: string;
  isFavorited: boolean;
  fullPrice?: number;
  discountPercent?: number;
  offerDetail?: string;
  isClaimed?: boolean;
  totalClaims?: number;
  claimDeal?: boolean;
}

export default function OffersPage() {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [availableFilters, setAvailableFilters] = useState<any>({});

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const [showClaimPopup, setShowClaimPopup] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  // Debounce search to avoid too many API calls
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (callback: () => void) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, 500);
    };
  }, []);

  // Fetch offers function
  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);

      // Build filter params
      const params: any = {
        page,
        limit: 12,
        sortBy,
      };

      // Add filters
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.neighbourhood)
        params.neighbourhood = activeFilters.neighbourhood;
      if (activeFilters.minRating) params.minRating = activeFilters.minRating;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;
      if (activeFilters.minDiscount)
        params.minDiscount = activeFilters.minDiscount;
      if (activeFilters.maxDiscount)
        params.maxDiscount = activeFilters.maxDiscount;

      let res;

      // If there's a search query, use SearchFlashDeal, otherwise GetAllFlashDeal
      if (searchQuery.trim()) {
        res = await dispatch(
          SearchFlashDeal({
            query: searchQuery.trim(),
            ...params,
          }) as any
        ).unwrap();
      } else {
        res = await dispatch(GetAllFlashDeal(params) as any).unwrap();
      }

      if (res.success) {
        // API returns flashDeals, not offers
        const offersData = res.data.flashDeals || [];

        // If pagination request (page > 1), append to existing offers
        if (page > 1) {
          setOffers((prev) => [...prev, ...offersData]);
        } else {
          setOffers(offersData);
        }

        setPagination(res.data.pagination || {});
        setAvailableFilters(res.data.filters || {});
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, sortBy, searchQuery, activeFilters]);

  // Effect for search and filter changes (reset to page 1)
  useEffect(() => {
    setPage(1);
    setOffers([]); // Clear offers when filters change
    debouncedSearch(() => fetchOffers());
  }, [sortBy, searchQuery, activeFilters]);

  // Effect for page changes (load more)
  useEffect(() => {
    if (page > 1) {
      fetchOffers();
    }
  }, [page]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFilter = (type: keyof ActiveFilters, value: any) => {
    setActiveFilters((prev) => {
      // Special handling for offerCategory
      if (type === "offerCat") {
        return { ...prev, category: value };
      }
      return { ...prev, [type]: value };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setSortBy("newest");
    setPage(1);
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.city) count++;
    if (activeFilters.neighbourhood) count++;
    if (activeFilters.minRating) count++;
    if (activeFilters.minPrice || activeFilters.maxPrice) count++;
    if (activeFilters.minDiscount || activeFilters.maxDiscount) count++;
    return count;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClaimOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowClaimPopup(true);
  };

  const loadMore = () => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const sortOptions: DropdownOption[] = useMemo(
    () => [
      { value: "newest", label: "Newest First" },
      { value: "rating", label: "Rating: High to Low" },
      { value: "reviews", label: "Most Reviews" },
      { value: "name", label: "Name: A to Z" },
      { value: "priceLowToHigh", label: "Price: Low to High" },
      { value: "priceHighToLow", label: "Price: High to Low" },
    ],
    []
  );

  const hasOffers = offers.length > 0;
  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
            availableFilters={availableFilters}
            visibleFilters={{
              offerCategory: true,
              city: true,
              neighbourhood: true,
              rating: true,
              price: true,
            }}
            filterType="offer"
          />
          <div className="flex-1">
            <SearchAndFilterSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              getActiveFilterCount={getActiveFilterCount}
              onSearch={fetchOffers}
            />

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {activeFilters.category && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>{activeFilters.category}</span>
                    <button
                      onClick={() => toggleFilter("category", "")}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.city && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>{activeFilters.city}</span>
                    <button
                      onClick={() => toggleFilter("city", "")}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.neighbourhood && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>{activeFilters.neighbourhood}</span>
                    <button
                      onClick={() => toggleFilter("neighbourhood", "")}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.minRating && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>{activeFilters.minRating}+ Stars</span>
                    <button
                      onClick={() => toggleFilter("minRating", undefined)}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {(activeFilters.minPrice || activeFilters.maxPrice) && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>
                      Price: {activeFilters.minPrice || 0} -{" "}
                      {activeFilters.maxPrice || "∞"}
                    </span>
                    <button
                      onClick={() => {
                        toggleFilter("minPrice", undefined);
                        toggleFilter("maxPrice", undefined);
                      }}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {(activeFilters.minDiscount || activeFilters.maxDiscount) && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>
                      Discount: {activeFilters.minDiscount || 0}% -{" "}
                      {activeFilters.maxDiscount || 100}%
                    </span>
                    <button
                      onClick={() => {
                        toggleFilter("minDiscount", undefined);
                        toggleFilter("maxDiscount", undefined);
                      }}
                      className="focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  {t("clear_all") || "Clear All"}
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div>
                <h2 className="text-h5 text-foreground font-bold mb-2">
                  {t("available_offers") || "Available Offers"}
                </h2>
                <p className="text-normal-regular text-muted-foreground">
                  {hasOffers
                    ? `${t("showing_deals") || "Showing"} ${offers.length} of ${
                        pagination?.totalItems || offers.length
                      } deals`
                    : "No deals found"}
                </p>
              </div>
              <div className="min-w-[200px]">
                <Dropdown
                  placeholder="Sort by"
                  options={sortOptions}
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val)}
                  variant="rounded"
                  className="w-full"
                />
              </div>
            </div>

            {/* All Offers Grid */}
            <div className="mb-12">
              <h3 className="text-h5 text-foreground font-bold mb-8">
                {t("all_offers") || "All Offers"}
              </h3>

              {loading && page === 1 ? (
                <div className="">
                  <SkeletonCard />
                </div>
              ) : hasOffers ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {offers.map((offer: Offer) => (
                      <OfferCard
                        key={offer._id}
                        id={offer._id}
                        title={offer.title}
                        description={offer.description}
                        images={offer.images}
                        city={offer.city}
                        neighbourhood={offer.neighbourhood}
                        rating={offer.rating}
                        reviewsCount={offer.reviewsCount}
                        category={offer.category}
                        discountedPrice={offer.discountedPrice || null}
                        isFavorited={offer.isFavorited}
                        originalPrice={offer.originalPrice || offer.fullPrice}
                        discountPercentage={
                          offer.discountPercentage || offer.discountPercent
                        }
                        expiryDate={offer.expiryDate}
                        flashDeal={offer.flashDeal}
                        offerDetail={offer.offerDetail}
                        adType={offer.adType}
                        isClaimed={offer.isClaimed}
                        isResponsive={true}
                        className="w-full max-w-md mx-auto"
                        onClaim={() => handleClaimOffer(offer)}
                      />
                    ))}
                  </div>

                  {pagination?.hasNextPage && (
                    <div className="text-center mt-12">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={loadMore}
                        disabled={loading}
                        className="rounded-xl px-10 py-4"
                      >
                        {loading
                          ? "Loading..."
                          : t("load_more_deals") || "Load More Deals"}
                        <TrendingUp className="ml-3 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No offers found. Try adjusting your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Claim Popup */}
      {showClaimPopup && selectedOffer && (
        <OfferPopup
          offer={selectedOffer}
          open={showClaimPopup}
          onOpenChange={setShowClaimPopup}
        />
      )}
    </div>
  );
}

// Reusable Search & Filter Section
function SearchAndFilterSection({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  getActiveFilterCount,
  onSearch,
}: any) {
  const t = useTranslations();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [locationError, setLocationError] = useState<string>("");
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

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
    setIsGettingLocation(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorText = "Geolocation is not supported by this browser";
      setLocationError(errorText);
      setIsGettingLocation(false);
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
      setIsGettingLocation(false);
      return;
    }

    // Check permissions API if available
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permissionStatus.state === "denied") {
          setLocationError(
            "Location access is blocked. Please enable it in your browser settings."
          );
          setIsGettingLocation(false);
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

          // Set location name in search bar
          setSearchQuery(locationName);

          // Trigger search after a short delay to ensure state is updated
          setTimeout(() => {
            if (onSearch) {
              onSearch();
            }
          }, 100);
        } catch (error) {
          console.error("Error getting location name:", error);
          // Fallback to coordinates
          const locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`;
          setSearchQuery(locationText);

          setTimeout(() => {
            if (onSearch) {
              onSearch();
            }
          }, 100);
        } finally {
          setIsGettingLocation(false);
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
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: false, // Changed to false for faster response
        timeout: 10000, // Reduced to 10 seconds
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (onSearch) {
        onSearch();
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="flex flex-row gap-4 items-center mb-4">
        <Button
          variant="normal"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-8 py-3 sm:py-5 relative text-white font-medium shrink-0"
        >
          <Filter className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
          {isDesktop ? t("filters") || "Filters" : ""}
          {getActiveFilterCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-grey-3" />
          <TextField
            type="text"
            placeholder={
              t("search_placeholder") ||
              "Search for offers by location, name, or category..."
            }
            className="pl-14 pr-16 py-3 focus:border-primary focus:ring-primary text-normal-regular bg-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2">
            <button
              onClick={handleLocationSearch}
              disabled={isGettingLocation}
              className={`p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary ${
                isGettingLocation
                  ? "bg-grey-4 cursor-not-allowed"
                  : "bg-grey-5 hover:bg-grey-4"
              }`}
              aria-label="Use current location"
            >
              <MapPin
                className={`w-4 h-4 ${
                  isGettingLocation ? "text-grey-3" : "text-grey-2"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{locationError}</p>
        </div>
      )}

      {/* Loading State */}
      {isGettingLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-700 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-2 animate-pulse" />
            Getting your location...
          </p>
        </div>
      )}
    </div>
  );
}
