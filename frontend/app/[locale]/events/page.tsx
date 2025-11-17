"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  ArrowUp,
  Flame,
  Search,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { Dropdown, type DropdownOption } from "@/components/common/dropdown";
import { Input } from "@/components/common/input";
import { Pagination } from "@/components/common/pagination";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { GetAllEvents, SearchEvents } from "@/features/slicer/AdSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import AdCard from "@/components/common/ad-card";
import { FilterSidebar } from "@/components/filterSidebarProduct";
import { HeroSection } from "@/components/event-page/hero-section";
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
  features: string[];
  discount?: boolean;
  inStock?: boolean;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
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
        <h2 className="text-h5 text-foreground font-bold mb-2">All Events</h2>
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

export default function EventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortByState] = useState<string>("newest");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsData, setEventsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Use debounce for search query (500ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Initialize activeFilters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const cityParam = searchParams.get("city");
    const ratingParam = searchParams.get("minRating");
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const eventTypeParam = searchParams.get("eventType");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    return {
      category: categoryParam || "",
      subcategory: subcategoryParam || "",
      city: cityParam || "",
      neighbourhood: "",
      minRating: ratingParam ? parseInt(ratingParam) : 0,
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 0,
      eventType: eventTypeParam || "",
      startDate: startDateParam || "",
      endDate: endDateParam || "",
      features: [],
    };
  });

  // Static sort options
  const sortOptions: DropdownOption[] = useMemo(
    () => [
      { value: "relevance", label: "Relevance" },
      { value: "newest", label: "Newest First" },
      { value: "rating", label: "Rating: High to Low" },
      { value: "reviews", label: "Most Reviews" },
      { value: "name", label: "Name: A to Z" },
      { value: "dateAsc", label: "Date: Soonest First" },
      { value: "dateDesc", label: "Date: Latest First" },
    ],
    []
  );

  const setSortBy = useCallback((value: string) => {
    setSortByState(value);
    // Set sort order based on selection
    if (value === "name" || value === "dateAsc") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
  }, []);

  // Fetch all events data with filters
  const fetchAllEvents = useCallback(
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
          eventType: activeFilters.eventType || undefined,
          startDate: activeFilters.startDate || undefined,
          endDate: activeFilters.endDate || undefined,
          sortBy,
          sortOrder,
        };

        // Remove undefined values
        Object.keys(filters).forEach((key) => {
          if (filters[key] === undefined) {
            delete filters[key];
          }
        });

        console.log("Fetching events with filters:", filters);

        const res = await dispatch(
          GetAllEvents({
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        console.log("Events API Response:", res);

        if (res.success) {
          setEventsData(res.data);
        }
      } catch (error) {
        console.error("Error fetching events data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, activeFilters, sortBy, sortOrder]
  );

  // Fetch search results
  const fetchSearchEvents = useCallback(
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
          eventType: activeFilters.eventType || undefined,
          startDate: activeFilters.startDate || undefined,
          endDate: activeFilters.endDate || undefined,
          sortBy,
          sortOrder,
        };

        // Remove undefined values
        Object.keys(filters).forEach((key) => {
          if (filters[key] === undefined) {
            delete filters[key];
          }
        });

        console.log("Searching events with filters:", { query, ...filters });

        const res = await dispatch(
          SearchEvents({
            query,
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        console.log("Events Search API Response:", res);

        if (res.success) {
          setEventsData(res.data);
        }
      } catch (error) {
        console.error("Error searching events:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, activeFilters, sortBy, sortOrder]
  );

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, debouncedSearchQuery]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      fetchSearchEvents(debouncedSearchQuery, currentPage, 9);
    } else {
      fetchAllEvents(currentPage, 9);
    }
  }, [
    currentPage,
    sortBy,
    sortOrder,
    activeFilters,
    debouncedSearchQuery,
    fetchAllEvents,
    fetchSearchEvents,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFilter = useCallback((type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "features") {
        return {
          ...prev,
          features: prev.features.includes(value)
            ? prev.features.filter((f) => f !== value)
            : [...prev.features, value],
        };
      } else if (type === "discount" || type === "inStock") {
        return {
          ...prev,
          [type]: value === "true" ? true : value === "false" ? false : value,
        };
      }
      return { ...prev, [type]: value };
    });
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
      eventType: "",
      startDate: "",
      endDate: "",
      features: [],
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
    if (activeFilters.eventType) count++;
    if (activeFilters.startDate) count++;
    if (activeFilters.endDate) count++;
    count += activeFilters.features.length;
    return count;
  }, [activeFilters]);

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

  // Transform API data to AdCard format for events - CORRECTED
  const transformedEventsData = useMemo(() => {
    if (!eventsData?.eventAds) {
      console.log("No eventAds found in data:", eventsData);
      return [];
    }

    console.log("Transforming eventAds:", eventsData.eventAds);

    return eventsData.eventAds.map((item: any) => ({
      id: item._id,
      type: "event" as const,
      title: item.title,
      subtitle: item.description,
      image: item.images?.[0] || "/placeholder.svg",
      category: item.category || "",
      subcategory: item.subCategory || "",
      rating: item.rating || 0,
      reviewCount: item.reviewsCount || 0,
      price: item.price || item.askingPrice || 0,
      originalPrice: item.originalPrice || null,
      discount: item.discountPercent || 0,
      location: `${item.city || ""}, ${item.neighbourhood || ""}`
        .trim()
        .replace(/^,\s*|,\s*$/g, ""),
      isFavorited: item.isFavorited,
      favoritesCount: item.favoritesCount || 0,
      eventDate: item.eventDate,
      startTime: item.startTime,
      endTime: item.endTime,
      venue: item.venue,
      organizer: item.organizer,
    }));
  }, [eventsData]);

  // Get all events
  const allEvents = useMemo(() => {
    console.log("All events:", transformedEventsData);
    return transformedEventsData;
  }, [transformedEventsData]);

  // Debug logs
  useEffect(() => {
    console.log("Events Data:", eventsData);
    console.log("Transformed Events:", transformedEventsData);
    console.log("All Events:", allEvents);
    console.log("Loading:", loading);
  }, [eventsData, transformedEventsData, allEvents, loading]);

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
            availableFilters={eventsData?.filters || {}}
            filterType="events"
            visibleFilters={{
              city: true,
              neighbourhood: true,
              rating: true,
              date: true,
              eventType: true,
              features: true,
            }}
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
                {activeFilters.eventType && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>Event Type: {activeFilters.eventType}</span>
                    <button onClick={() => toggleFilter("eventType", "")}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                )}
                {activeFilters.features.map((feature) => (
                  <Badge
                    key={feature}
                    className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    <span>{feature}</span>
                    <button onClick={() => toggleFilter("features", feature)}>
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
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
                        ? `₹${activeFilters.minPrice}`
                        : "Any"}{" "}
                      -{" "}
                      {activeFilters.maxPrice > 0
                        ? `₹${activeFilters.maxPrice}`
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
                {(activeFilters.startDate || activeFilters.endDate) && (
                  <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                    <span>
                      Date: {activeFilters.startDate || "Any"} -{" "}
                      {activeFilters.endDate || "Any"}
                    </span>
                    <button
                      onClick={() => {
                        toggleFilter("startDate", "");
                        toggleFilter("endDate", "");
                      }}
                    >
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
              setSortBy={setSortBy}
              sortOptions={sortOptions}
            />

            {/* All Events Section */}
            <div className="mb-12">
              <h3 className="text-h5 text-foreground font-bold mb-8">
                All Events ({allEvents.length})
              </h3>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : allEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : "No events found matching your filters"}
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
                        Showing {allEvents.length} results for "
                        <strong>{searchQuery}</strong>"
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {allEvents.map((event: any) => (
                      <AdCard key={event.id} {...event} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {eventsData?.pagination &&
                    eventsData.pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={eventsData.pagination.totalPages}
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
