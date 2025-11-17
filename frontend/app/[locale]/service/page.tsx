"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X, ArrowUp, Flame } from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { Dropdown, type DropdownOption } from "@/components/common/dropdown";
import { Pagination } from "@/components/common/pagination";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { GetAllService, SearchService } from "@/features/slicer/AdSlice";
import { useDebounce } from "@/hooks/useDebounce";
import AdCard from "@/components/common/ad-card";
import { FilterSidebar } from "@/components/filterSidebarProduct";
import { HeroSection } from "@/components/service/hero-section";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { SearchAndFilterSection } from "@/components/common/SearchAndFilterSection";

interface ActiveFilters {
  category: string;
  subcategory: string;
  city: string;
  neighbourhood: string;
  minRating: number;
  minPrice: number;
  maxPrice: number;
  serviceType: string;
}

function SortAndViewOptions({
  sortBy,
  setSortBy,
  sortOptions,
}: {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOptions: DropdownOption[];
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">All Service</h2>
        <p className="text-normal-regular text-muted-foreground">
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Trending this week
          </span>
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="min-w-[200px]">
          <Dropdown
            placeholder="Newest First"
            options={sortOptions}
            value={sortBy}
            onValueChange={setSortBy}
            variant="rounded"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ServiceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Use debounce for search query (500ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Initialize activeFilters with proper default values
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: "",
    subcategory: "",
    city: "",
    neighbourhood: "",
    minRating: 0,
    minPrice: 0,
    maxPrice: 0,
    serviceType: "",
  });

  // Sort options
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

  // Fetch all Service data with filters
  const fetchAllService = useCallback(
    async (page: number, limit: number) => {
      try {
        setLoading(true);
        const filters: any = {
          category: activeFilters.category || undefined,
          subcategory: activeFilters.subcategory || undefined,
          city: activeFilters.city || undefined,
          neighbourhood: activeFilters.neighbourhood || undefined,
          minRating:
            activeFilters.minRating > 0 ? activeFilters.minRating : undefined,
          minPrice:
            activeFilters.minPrice > 0 ? activeFilters.minPrice : undefined,
          maxPrice:
            activeFilters.maxPrice > 0 ? activeFilters.maxPrice : undefined,
          serviceType: activeFilters.serviceType || undefined,
          sortBy: sortBy,
        };

        // Remove undefined values
        Object.keys(filters).forEach((key) => {
          if (filters[key] === undefined) {
            delete filters[key];
          }
        });

        console.log("Fetching Service with filters:", filters);

        const res = await dispatch(
          GetAllService({
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        console.log("API Response:", res);

        if (res.success) {
          setServiceData(res.data);
        }
      } catch (error) {
        console.error("Error fetching Service data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, activeFilters, sortBy]
  );

  // Fetch search results
  const fetchSearchService = useCallback(
    async (query: string, page: number, limit: number) => {
      try {
        setLoading(true);

        const filters: any = {
          category: activeFilters.category || undefined,
          subcategory: activeFilters.subcategory || undefined,
          city: activeFilters.city || undefined,
          neighbourhood: activeFilters.neighbourhood || undefined,
          minRating:
            activeFilters.minRating > 0 ? activeFilters.minRating : undefined,
          minPrice:
            activeFilters.minPrice > 0 ? activeFilters.minPrice : undefined,
          maxPrice:
            activeFilters.maxPrice > 0 ? activeFilters.maxPrice : undefined,
          serviceType: activeFilters.serviceType || undefined,
          sortBy: sortBy,
        };

        // Remove undefined values
        Object.keys(filters).forEach((key) => {
          if (filters[key] === undefined) {
            delete filters[key];
          }
        });

        console.log("Searching Service with filters:", { query, ...filters });

        const res = await dispatch(
          SearchService({
            query,
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        console.log("Search API Response:", res);

        if (res.success) {
          setServiceData(res.data);
        }
      } catch (error) {
        console.error("Error searching Service:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, activeFilters, sortBy]
  );

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, debouncedSearchQuery, sortBy]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      fetchSearchService(debouncedSearchQuery, currentPage, 9);
    } else {
      fetchAllService(currentPage, 9);
    }
  }, [
    currentPage,
    sortBy,
    activeFilters,
    debouncedSearchQuery,
    fetchAllService,
    fetchSearchService,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      category: "",
      subcategory: "",
      city: "",
      neighbourhood: "",
      minRating: 0,
      minPrice: 0,
      maxPrice: 0,
      serviceType: "",
    });
  }, []);

  const getActiveFilterCount = useCallback((): number => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.subcategory) count++;
    if (activeFilters.city) count++;
    if (activeFilters.neighbourhood) count++;
    if (activeFilters.minRating > 0) count++;
    if (activeFilters.minPrice > 0 || activeFilters.maxPrice > 0) count++;
    if (activeFilters.serviceType) count++;
    return count;
  }, [activeFilters]);

  const toggleFilter = useCallback((type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "serviceType") {
        return {
          ...prev,
          [type]: value === prev.serviceType ? "" : value,
        };
      }
      return {
        ...prev,
        [type]: value,
      };
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: any) => {
    setSearchQuery(suggestion.name || suggestion._id);
    setShowSuggestions(false);
  }, []);

  // Handle manual search
  const handleManualSearch = useCallback(() => {
    setCurrentPage(1);
    setShowSuggestions(false);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // Transform API data to AdCard format for Service
  const transformedServiceData = useMemo(() => {
    if (!ServiceData?.serviceAds) {
      console.log("No serviceAds found in data:", ServiceData);
      return [];
    }

    console.log("Transforming serviceAds:", ServiceData.serviceAds);

    return ServiceData.serviceAds.map((item: any) => ({
      id: item._id,
      type: "service" as const,
      title: item.title,
      subtitle: item.description,
      image: item.images?.[0] || "/placeholder.svg",
      category: item.category || "",
      subcategory: item.subCategory || "",
      rating: item.rating || 0,
      reviewCount: item.reviewsCount || 0,
      price: item.servicePrice || 0,
      location: `${item.city || ""}, ${item.neighbourhood || ""}`
        .trim()
        .replace(/^,\s*|,\s*$/g, ""),
      isFavorited: item.isFavorited,
      favoritesCount: item.favoritesCount || 0,
      serviceType: item.serviceType,
    }));
  }, [ServiceData]);

  // Get all Service
  const allService = useMemo(() => {
    console.log("All Service:", transformedServiceData);
    return transformedServiceData;
  }, [transformedServiceData]);

  // Debug logs
  useEffect(() => {
    console.log("Service Data:", ServiceData);
    console.log("Transformed Service:", transformedServiceData);
    console.log("All Service:", allService);
    console.log("Loading:", loading);
    console.log("Active Filters:", activeFilters);
    console.log("Sort By:", sortBy);
  }, [
    ServiceData,
    transformedServiceData,
    allService,
    loading,
    activeFilters,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="w-full">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleManualSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          onHideSuggestions={() => setShowSuggestions(false)}
        />
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar */}
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
            availableFilters={ServiceData?.filters || {}}
            visibleFilters={{
              category: true,
              subcategory: true,
              city: true,
              neighbourhood: true,
              rating: true,
              price: true,
              serviceType: true,
            }}
            filterType="service"
          />

          <div className="flex-1">
            <SearchAndFilterSection
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              getActiveFilterCount={getActiveFilterCount}
            />

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {activeFilters.category && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>Category: {activeFilters.category}</span>
                    <button onClick={() => toggleFilter("category", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.subcategory && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>Subcategory: {activeFilters.subcategory}</span>
                    <button onClick={() => toggleFilter("subcategory", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}

                {activeFilters.city && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>City: {activeFilters.city}</span>
                    <button onClick={() => toggleFilter("city", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.neighbourhood && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>Area: {activeFilters.neighbourhood}</span>
                    <button onClick={() => toggleFilter("neighbourhood", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.minRating > 0 && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>Rating: {activeFilters.minRating}+</span>
                    <button onClick={() => toggleFilter("minRating", 0)}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {(activeFilters.minPrice > 0 || activeFilters.maxPrice > 0) && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>
                      Price:{" "}
                      {activeFilters.minPrice > 0
                        ? `$${activeFilters.minPrice}`
                        : "Any"}{" "}
                      -{" "}
                      {activeFilters.maxPrice > 0
                        ? `$${activeFilters.maxPrice}`
                        : "Any"}
                    </span>
                    <button
                      onClick={() => {
                        toggleFilter("minPrice", 0);
                        toggleFilter("maxPrice", 0);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.serviceType && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span className="capitalize">
                      Service: {activeFilters.serviceType}
                    </span>
                    <button onClick={() => toggleFilter("serviceType", "")}>
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
                  Clear All
                </Button>
              </div>
            )}

            <SortAndViewOptions
              sortBy={sortBy}
              setSortBy={handleSortChange}
              sortOptions={sortOptions}
            />

            {/* All Service Section */}
            <div className="mb-12">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : allService.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : "No Service found matching your filters"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                      }}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="mt-4 ml-2"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <div className="mb-6 text-center">
                      <p className="text-muted-foreground">
                        Showing {allService.length} results for "
                        <strong>{searchQuery}</strong>"
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {allService.map((service: any) => (
                      <AdCard key={service.id} {...service} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {ServiceData?.pagination &&
                    ServiceData.pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={ServiceData.pagination.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                </>
              )}
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
  );
}
