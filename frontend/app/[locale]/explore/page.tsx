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
import { GetAllExplore, SearchExplore } from "@/features/slicer/AdSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import AdCard from "@/components/common/ad-card"; // Assuming the AdCard is in this path
import { FilterSidebar } from "@/components/filterSidebarProduct";
import { HeroSection } from "@/components/explore/hero-section";
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
        <h2 className="text-h5 text-foreground font-bold mb-2">All Places</h2>
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

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortByState] = useState<string>("newest");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exploreData, setExploreData] = useState<any>(null);
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
    const subCategoryParam = searchParams.get("subCategory");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const discountParam = searchParams.get("discount");
    const inStockParam = searchParams.get("inStock");

    return {
      category: categoryParam || "",
      subCategory: subCategoryParam || "", //  Products ke liye
      city: cityParam || "",
      neighbourhood: "",
      minRating: ratingParam ? parseInt(ratingParam) : 0,
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0, //  Price filters
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 0,
      discount: discountParam === "true", //  Boolean filter
      inStock: inStockParam === "true", //  Stock filter
      features: [],
    };
  });
  // Static sort options
  const sortOptions: DropdownOption[] = useMemo(
    () => [
      { value: "newest", label: "Newest First" },
      { value: "rating", label: "Rating: High to Low" },
      { value: "reviews", label: "Most Reviews" },
      { value: "name", label: "Name: A to Z" },
    ],
    []
  );

  const setSortBy = useCallback((value: string) => {
    setSortByState(value);
    setSortOrder(value === "name" ? "asc" : "desc");
  }, []);

  // Fetch all explore data with filters
  const fetchAllExplore = useCallback(
    async (page: number, limit: number) => {
      try {
        setLoading(true);
        const filters = {
          category: activeFilters.category || undefined,
          city: activeFilters.city || undefined,
          neighbourhood: activeFilters.neighbourhood || undefined,
          minRating:
            activeFilters.minRating > 0 ? activeFilters.minRating : undefined,
          features:
            activeFilters.features.length > 0
              ? activeFilters.features
              : undefined,
          sortBy,
          sortOrder,
        };
        const res = await dispatch(
          GetAllExplore({
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        if (res.success) {
          setExploreData(res.data);
          console.log(res.data, "res[omse");
        }
      } catch (error) {
        console.error("Error fetching explore data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, activeFilters, sortBy, sortOrder]
  );

  // Fetch search results
  const fetchSearchExplore = useCallback(
    async (query: string, page: number, limit: number) => {
      try {
        setLoading(true);

        const filters = {
          category: activeFilters.category || undefined,
          city: activeFilters.city || undefined,
          neighbourhood: activeFilters.neighbourhood || undefined,
          minRating:
            activeFilters.minRating > 0 ? activeFilters.minRating : undefined,
          features:
            activeFilters.features.length > 0
              ? activeFilters.features
              : undefined,
          sortBy,
          sortOrder,
        };

        const res = await dispatch(
          SearchExplore({
            query,
            page,
            limit,
            ...filters,
          }) as any
        ).unwrap();

        if (res.success) {
          setExploreData(res.data);
          console.log(res.data, "res[omse");
        }
      } catch (error) {
        console.error("Error searching explore:", error);
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
      fetchSearchExplore(debouncedSearchQuery, currentPage, 9);
    } else {
      fetchAllExplore(currentPage, 9);
    }
  }, [
    currentPage,
    sortBy,
    sortOrder,
    activeFilters,
    debouncedSearchQuery,
    fetchAllExplore,
    fetchSearchExplore,
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
      }
      return { ...prev, [type]: value };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      category: "",
      subCategory: "", //  Products ke liye add karo
      city: "",
      neighbourhood: "",
      minRating: 0,
      minPrice: 0, //  Price filters add karo
      maxPrice: 0,
      discount: false, //  Discount filter add karo
      inStock: false, //  Stock filter add karo
      features: [], // Agar products mein features hain toh
    });
  }, []);

  const getActiveFilterCount = useCallback((): number => {
    return (
      (activeFilters.category ? 1 : 0) +
      activeFilters.features.length +
      (activeFilters.city ? 1 : 0) +
      (activeFilters.neighbourhood ? 1 : 0) +
      (activeFilters.minRating > 0 ? 1 : 0)
    );
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

  // Transform API data to AdCard format for explore
  const transformedExploreData = useMemo(() => {
    if (!exploreData?.exploreAds) return [];

    return exploreData.exploreAds.map((item: any) => ({
      id: item._id,
      type: "explore" as const,
      title: item.title,
      subtitle: item.description,
      image: item.images?.[0] || "/placeholder.svg",
      category: item.category || "",
      rating: item.rating || 0,
      reviewCount: item.reviewsCount || 0,
      exploreName: item.exploreName,
      exploreDescription: item.exploreDescription,
      location: `${item.city}, ${item.neighbourhood}`,
      isFavorited: item.isFavorited, // Can be dynamic if needed
      favoritesCount: item.favoritesCount || 0,
    }));
  }, [exploreData]);

  // Get trending places (top rated ones)
  const trendingPlaces = useMemo(() => {
    return transformedExploreData
      .filter((place: any) => place.rating >= 4)
      .slice(0, 3);
  }, [transformedExploreData]);

  // Get all places
  const allPlaces = useMemo(() => {
    return transformedExploreData;
  }, [transformedExploreData]);

  console.log(transformedExploreData, "transformedExploreData");
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleManualSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          onHideSuggestions={() => setShowSuggestions(false)}
        />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar */}
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            getActiveFilterCount={getActiveFilterCount}
            availableFilters={exploreData?.filters || {}}
            visibleFilters={{
              city: true,
              neighbourhood: true,
              rating: true,
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

            {/* All Places Section */}
            <div className="mb-4">
              {loading || allPlaces.length === 0 ? (
                <div className="text-center py-12">
                  {loading ? null : (
                    <p className="text-muted-foreground text-lg">
                      {searchQuery
                        ? `No results found for "${searchQuery}"`
                        : "No explore places found matching your filters"}
                    </p>
                  )}
                  {searchQuery && !loading && (
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
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <div className="mb-6 text-center">
                      <p className="text-muted-foreground">
                        Showing results for "<strong>{searchQuery}</strong>"
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {loading
                      ? Array.from({ length: 9 }).map((_, index) => (
                          <SkeletonCard key={index} />
                        ))
                      : allPlaces.map((place: any) => (
                          <AdCard key={place.id} {...place} />
                        ))}
                  </div>

                  {/* Pagination */}
                  {exploreData?.pagination &&
                    exploreData.pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={exploreData.pagination.totalPages}
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
