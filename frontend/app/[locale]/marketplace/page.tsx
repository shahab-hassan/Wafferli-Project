"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Filter, X, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { Dropdown, type DropdownOption } from "@/components/common/dropdown";
import { MarketplaceProductCard } from "@/components/marketplace/marketplace-product-card";
import { MarketplaceServiceCard } from "@/components/marketplace/marketplace-service-card";
import { MarketplaceHero } from "@/components/marketplace/marketplace-hero";
import { MarketplaceTabs } from "@/components/marketplace/marketplace-tabs";
import { MarketplaceCategories } from "@/components/marketplace/marketplace-categories";
import { MarketplaceServiceCategories } from "@/components/marketplace/marketplace-service-categories";
import { MarketplaceSubcategories } from "@/components/marketplace/marketplace-subcategories";
import { Pagination } from "@/components/common/pagination";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  GetAllProducts,
  GetAllService,
  SearchProducts,
  SearchService,
} from "@/features/slicer/AdSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { FilterSidebar } from "@/components/filterSidebarProduct";

interface ActiveFilters {
  category?: string;
  subcategory?: string;
  city?: string;
  neighbourhood?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  discount?: boolean;
  inStock?: boolean;
  serviceType?: string;
}

interface ActiveServiceFilters {
  category?: string;
  subcategory?: string;
  city?: string;
  neighbourhood?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  serviceType?: string;
}

interface SearchAndFilterSectionProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  getActiveFilterCount: () => number;
}

interface SortAndViewOptionsProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalProducts: number;
}

function SearchAndFilterSection({
  showFilters,
  setShowFilters,
  getActiveFilterCount,
}: SearchAndFilterSectionProps) {
  const t = useTranslations();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

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
  );
}

function SortAndViewOptions({
  sortBy,
  setSortBy,
  totalProducts,
}: SortAndViewOptionsProps) {
  const t = useTranslations();

  const sortOptions: DropdownOption[] = [
    { value: "newest", label: t("marketplace.sortOptions.newestFirst") },
    { value: "rating", label: t("marketplace.sortOptions.ratingHighLow") },
    { value: "price_low", label: t("marketplace.sortOptions.priceLowHigh") },
    { value: "price_high", label: t("marketplace.sortOptions.priceHighLow") },
    { value: "popular", label: t("marketplace.sortOptions.mostPopular") },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h2 className="text-h5 text-foreground font-bold mb-2">
          {t("marketplace.sections.allElectronics")}
        </h2>
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
  );
}

export default function MarketplacePage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.auth.role);

  const sliderRef = useRef<HTMLDivElement>(null);
  const initialTab =
    searchParams.get("tab") === "services" ? "services" : "products";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [committedSearchQuery, setCommittedSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    initialTab
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeServiceCategory, setActiveServiceCategory] =
    useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [productsData, setProductsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Use debounce for search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use your FilterSidebar compatible filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: "all",
    subcategory: "all",
    city: "",
    neighbourhood: "",
    minRating: 0,
    minPrice: 0,
    maxPrice: 0,
    features: [],
    discount: false,
    inStock: false,
  });

  const [activeServiceFilters, setActiveServiceFilters] =
    useState<ActiveServiceFilters>({
      category: "all",
      subcategory: "all",
      city: "",
      neighbourhood: "",
      minRating: 0,
      minPrice: 0,
      maxPrice: 0,
      serviceType: "",
    });

  // Fetch products data
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = {
        category:
          activeFilters.category !== "all" ? activeFilters.category : undefined,
        subcategory:
          activeFilters.subcategory !== "all"
            ? activeFilters.subcategory
            : undefined,
        city: activeFilters.city || undefined,
        neighbourhood: activeFilters.neighbourhood || undefined,
        minRating:
          activeFilters.minRating > 0 ? activeFilters.minRating : undefined,
        minPrice:
          activeFilters.minPrice > 0 ? activeFilters.minPrice : undefined,
        maxPrice:
          activeFilters.maxPrice > 0 ? activeFilters.maxPrice : undefined,
        sortBy: sortBy,
      };

      // Remove undefined values
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      let res;
      if (committedSearchQuery.trim()) {
        res = await dispatch(
          SearchProducts({
            query: committedSearchQuery,
            page: currentPage,
            limit: 9,
            ...filters,
          }) as any
        ).unwrap();
      } else {
        res = await dispatch(
          GetAllProducts({
            page: currentPage,
            limit: 9,
            ...filters,
          }) as any
        ).unwrap();
      }

      if (res.success) {
        setProductsData(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, activeFilters, sortBy, committedSearchQuery, currentPage]);

  // Fetch services data
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = {
        category:
          activeServiceFilters.category !== "all"
            ? activeServiceFilters.category
            : undefined,
        subcategory:
          activeServiceFilters.subcategory !== "all"
            ? activeServiceFilters.subcategory
            : undefined,
        city: activeServiceFilters.city || undefined,
        neighbourhood: activeServiceFilters.neighbourhood || undefined,
        minRating:
          activeServiceFilters.minRating > 0
            ? activeServiceFilters.minRating
            : undefined,
        minPrice:
          activeServiceFilters.minPrice > 0
            ? activeServiceFilters.minPrice
            : undefined,
        maxPrice:
          activeServiceFilters.maxPrice > 0
            ? activeServiceFilters.maxPrice
            : undefined,
        serviceType: activeServiceFilters.serviceType || undefined,
        sortBy: sortBy,
      };

      // Remove undefined values
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      let res;
      if (committedSearchQuery.trim()) {
        res = await dispatch(
          SearchService({
            query: committedSearchQuery,
            page: currentPage,
            limit: 9,
            ...filters,
          }) as any
        ).unwrap();
      } else {
        res = await dispatch(
          GetAllService({
            page: currentPage,
            limit: 9,
            ...filters,
          }) as any
        ).unwrap();
      }

      if (res.success) {
        setServicesData(res.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    activeServiceFilters,
    sortBy,
    committedSearchQuery,
    currentPage,
  ]);

  // Scroll functionality
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 340;
      const newScrollLeft =
        direction === "left"
          ? sliderRef.current.scrollLeft - scrollAmount
          : sliderRef.current.scrollLeft + scrollAmount;

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Filter functions for products
  const toggleFilter = useCallback((type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "features") {
        const currentArray = prev.features || [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
        return { ...prev, [type]: newArray };
      }
      return { ...prev, [type]: value };
    });
  }, []);

  // Filter functions for services
  const toggleServiceFilter = useCallback((type: string, value: any) => {
    setActiveServiceFilters((prev) => {
      if (type === "serviceType") {
        return {
          ...prev,
          [type]: value === prev.serviceType ? "" : value,
        };
      }
      return { ...prev, [type]: value };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      category: "all",
      subcategory: "all",
      city: "",
      neighbourhood: "",
      minRating: 0,
      minPrice: 0,
      maxPrice: 0,
      features: [],
      discount: false,
      inStock: false,
    });
  }, []);

  const clearAllServiceFilters = useCallback(() => {
    setActiveServiceFilters({
      category: "all",
      subcategory: "all",
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
    if (activeFilters.category && activeFilters.category !== "all") count++;
    if (activeFilters.subcategory && activeFilters.subcategory !== "all")
      count++;
    if (activeFilters.city) count++;
    if (activeFilters.neighbourhood) count++;
    if (activeFilters.minRating > 0) count++;
    if (activeFilters.minPrice > 0 || activeFilters.maxPrice > 0) count++;
    if (activeFilters.discount) count++;
    if (activeFilters.inStock) count++;
    count += activeFilters.features?.length || 0;
    return count;
  }, [activeFilters]);

  const getActiveServiceFilterCount = useCallback((): number => {
    let count = 0;
    if (
      activeServiceFilters.category &&
      activeServiceFilters.category !== "all"
    )
      count++;
    if (
      activeServiceFilters.subcategory &&
      activeServiceFilters.subcategory !== "all"
    )
      count++;
    if (activeServiceFilters.city) count++;
    if (activeServiceFilters.neighbourhood) count++;
    if (activeServiceFilters.minRating > 0) count++;
    if (activeServiceFilters.minPrice > 0 || activeServiceFilters.maxPrice > 0)
      count++;
    if (activeServiceFilters.serviceType) count++;
    return count;
  }, [activeServiceFilters]);

  // Search handlers
  const handleSearch = (searchData: any) => {
    setCommittedSearchQuery(searchData.query);
    setSelectedType(searchData.type);

    if (searchData.type === "products") {
      setActiveTab("products");
    } else if (searchData.type === "services") {
      setActiveTab("services");
    }
  };

  const handleTabChange = (newTab: "products" | "services") => {
    setActiveTab(newTab);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", newTab);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  // Transform API data to proper format for MarketplaceProductCard
  const transformedProducts = useMemo(() => {
    if (!productsData?.productAds) return [];

    return productsData.productAds.map((item: any) => ({
      data: {
        id: item._id,
        name: item.title,
        brand: item.brand || "Unknown",
        image: item.images?.[0] || "/placeholder.svg",
        rating: item.rating || 0,
        reviewCount: item.reviewsCount || 0,
        price: item.askingPrice || 0,
        originalPrice: item.originalPrice,
        isFavorited: item.isFavorited || false,
        discount: item.discountPercent || 0,
        description: item.description,
        sellerName: item.userId?.name || "Unknown Seller",
        sellerLogo: item.userId?.profilePicture || "",
        location: `${item.city || ""}, ${item.neighbourhood || ""}`
          .trim()
          .replace(/^,\s*|,\s*$/g, ""),
        category: item.category,
        subcategory: item.subCategory,
        inStock: item.quantity > 0,
      },
    }));
  }, [productsData]);

  const transformedServices = useMemo(() => {
    if (!servicesData?.serviceAds) return [];

    return servicesData.serviceAds.map((item: any) => ({
      id: item._id,
      name: item.title,
      category: item.category,
      subcategory: item.subCategory,
      image: item.images?.[0] || "/placeholder.svg",
      rating: item.rating || 0,
      reviewCount: item.reviewsCount || 0,
      startingPrice: item.servicePrice || 0,
      description: item.description,
      seller: item.userId?.name || "Unknown",
      location: `${item.city || ""}, ${item.neighbourhood || ""}`
        .trim()
        .replace(/^,\s*|,\s*$/g, ""),
    }));
  }, [servicesData]);

  // All active items for seller view
  const allActive = useMemo(() => {
    const activeProducts = transformedProducts.filter((p) => p.data.inStock);
    const activeServices = transformedServices;
    return [...activeProducts, ...activeServices];
  }, [transformedProducts, transformedServices]);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        slider.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [role, allActive]);

  useEffect(() => {
    const tab =
      searchParams.get("tab") === "services" ? "services" : "products";
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeFilters,
    activeServiceFilters,
    committedSearchQuery,
    activeCategory,
    activeServiceCategory,
    activeSubcategory,
  ]);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else {
      fetchServices();
    }
  }, [activeTab, fetchProducts, fetchServices]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setSearchQuery(suggestion.name || suggestion.title || "");
    setShowSuggestions(false);
  };

  const totalPages =
    activeTab === "products"
      ? productsData?.pagination?.totalPages || 1
      : servicesData?.pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MarketplaceHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onSearch={handleSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          onHideSuggestions={() => setShowSuggestions(false)}
          products={transformedProducts.map((p) => p.data)}
          services={transformedServices}
        />

        {/* {role === "seller" && allActive.length > 0 && (
          <div className="mt-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 px-4">
              {t("marketplace.allAds")}
            </h2>
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
                  <div
                    key={item.data?.id || item.id}
                    className="flex-shrink-0 w-[340px]"
                  >
                    {"data" in item ? (
                      <MarketplaceProductCard
                        data={item.data}
                        className="w-full"
                      />
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
        )} */}

        <MarketplaceTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "products" && (
          <>
            <MarketplaceCategories
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            {/* <MarketplaceSubcategories
              activeSubcategory={activeSubcategory}
              onSubcategoryChange={setActiveSubcategory}
            /> */}

            <div className="flex flex-col lg:flex-row gap-10">
              <FilterSidebar
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                clearAllFilters={clearAllFilters}
                getActiveFilterCount={getActiveFilterCount}
                availableFilters={productsData?.filters || {}}
                visibleFilters={{
                  category: true,
                  subcategory: true,
                  city: true,
                  neighbourhood: true,
                  rating: true,
                  price: true,
                  features: true,
                  discount: true,
                  inStock: true,
                }}
                filterType="products"
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
                    {activeFilters.category &&
                      activeFilters.category !== "all" && (
                        <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                          <span>Category: {activeFilters.category}</span>
                          <button
                            onClick={() => toggleFilter("category", "all")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      )}
                    {activeFilters.subcategory &&
                      activeFilters.subcategory !== "all" && (
                        <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                          <span>Subcategory: {activeFilters.subcategory}</span>
                          <button
                            onClick={() => toggleFilter("subcategory", "all")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      )}
                    {activeFilters.features?.map((feature) => (
                      <Badge
                        key={feature}
                        className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          onClick={() => toggleFilter("features", feature)}
                        >
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
                      Clear All
                    </Button>
                  </div>
                )}

                <SortAndViewOptions
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  totalProducts={transformedProducts.length}
                />
                <div className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {transformedProducts.map((product) => (
                      <MarketplaceProductCard
                        key={product.data.id}
                        data={product.data}
                        className="w-full max-w-md mx-auto"
                      />
                    ))}
                  </div>
                  {transformedProducts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t("marketplace.noProductsFound")}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t("marketplace.tryAdjustingFilters")}
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="rounded-full bg-transparent"
                      >
                        {t("marketplace.filters.clearAll")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mb-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "services" && (
          <>
            <MarketplaceServiceCategories
              activeServiceCategory={activeServiceCategory}
              onServiceCategoryChange={setActiveServiceCategory}
            />

            <div className="flex flex-col lg:flex-row gap-10">
              <FilterSidebar
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                activeFilters={activeServiceFilters}
                toggleFilter={toggleServiceFilter}
                clearAllFilters={clearAllServiceFilters}
                getActiveFilterCount={getActiveServiceFilterCount}
                availableFilters={servicesData?.filters || {}}
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

                {/* Active Service Filters Display */}
                {getActiveServiceFilterCount() > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {activeServiceFilters.category &&
                      activeServiceFilters.category !== "all" && (
                        <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                          <span>Category: {activeServiceFilters.category}</span>
                          <button
                            onClick={() =>
                              toggleServiceFilter("category", "all")
                            }
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </Badge>
                      )}
                    {activeServiceFilters.serviceType && (
                      <Badge className="bg-accent text-primary rounded-full px-4 py-2 flex items-center space-x-2 text-sm">
                        <span className="capitalize">
                          Service: {activeServiceFilters.serviceType}
                        </span>
                        <button
                          onClick={() => toggleServiceFilter("serviceType", "")}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllServiceFilters}
                      className="text-muted-foreground hover:text-foreground rounded-full"
                    >
                      Clear All
                    </Button>
                  </div>
                )}

                <div className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {transformedServices.map((service) => (
                      <MarketplaceServiceCard
                        key={service.id}
                        {...service}
                        className="w-full max-w-md mx-auto"
                      />
                    ))}
                  </div>
                  {transformedServices.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t("marketplace.noServicesFound")}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t("marketplace.tryAdjustingFilters")}
                      </p>
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
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
  );
}
