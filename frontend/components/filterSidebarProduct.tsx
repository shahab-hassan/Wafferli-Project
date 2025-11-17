import { useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dropdown, type DropdownOption } from "@/components/common/dropdown";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./common/shadecn-card";
import { Button } from "./common/button";
import { ChevronDown, X, Star } from "lucide-react";
import {
  allCity,
  allNeighborhood,
  productCategories,
  productSubCategories,
  serviceCategories,
  serviceSubCategories,
  serviceType,
  eventType,
  offerCategories,
} from "@/lib/data";

interface ActiveFilters {
  category?: string;
  subcategory?: string;
  offerCat?: string;
  city?: string;
  neighbourhood?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  discount?: boolean;
  inStock?: boolean;
  eventDate?: string;
  eventType?: string;
  priceType?: "fixed" | "negotiable" | "free";
  startDate?: string;
  endDate?: string;
  serviceType: string[];
}

interface FilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: ActiveFilters;
  toggleFilter?: (type: string, value: any) => void;
  clearAllFilters: () => void;
  getActiveFilterCount: () => number;
  availableFilters: any;
  visibleFilters?: {
    category?: boolean;
    subcategory?: boolean;
    city?: boolean;
    neighbourhood?: boolean;
    rating?: boolean;
    price?: boolean;
    features?: boolean;
    discount?: boolean;
    inStock?: boolean;
    date?: boolean;
    eventType?: boolean;
    priceType?: boolean;
    serviceType: boolean;
    offerCategory?: boolean;
  };
  filterType?: "products" | "events" | "explore" | "general" | "service";
}

export function FilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  getActiveFilterCount,
  availableFilters,
  visibleFilters = {
    category: false,
    subcategory: false,
    city: true,
    neighbourhood: true,
    rating: true,
    price: false,
    features: false,
    discount: false,
    inStock: false,
    date: false,
    eventType: false,
    priceType: false,
    serviceType: false,
    offerCategory: false,
  },
  filterType = "general",
}: FilterSidebarProps) {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  // Initialize expanded sections based on visible filters
  const initialExpandedSections = useMemo(
    () => ({
      category: visibleFilters.category || false,
      subcategory: visibleFilters.subcategory || false,
      location: visibleFilters.city || visibleFilters.neighbourhood || false,
      rating: visibleFilters.rating || false,
      price: visibleFilters.price || false,
      features: visibleFilters.features || false,
      offerCategory: visibleFilters.offerCategory || false,
      availability: visibleFilters.discount || visibleFilters.inStock || false,
      eventType: visibleFilters.eventType || false,
      priceType: visibleFilters.priceType || false,
      date: visibleFilters.date || false,
      serviceType: visibleFilters.serviceType || false,
    }),
    [visibleFilters]
  );

  const [expandedSections, setExpandedSections] = useState(
    initialExpandedSections
  );

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    []
  );

  const getCombinedCategories = (availableFilters: any) => {
    const apiCategories = availableFilters?.categories || [];

    // Create a map of API categories for quick lookup
    const apiCategoryMap = new Map(
      apiCategories.map((cat: any) => [cat._id.toLowerCase(), cat.count])
    );

    // Combine with predefined categories
    const combined = offerCategories.map((category) => ({
      _id: category,
      count: apiCategoryMap.get(category.toLowerCase()) || 0,
    }));

    // Sort: categories with products first, then alphabetically
    return combined.sort((a, b) => {
      if (a.count === 0 && b.count === 0) return a._id.localeCompare(b._id);
      if (a.count === 0) return 1;
      if (b.count === 0) return -1;
      return b.count - a.count; // Higher count first
    });
  };
  // Category Options based on filterType
  const categoryOptions: DropdownOption[] = useMemo(() => {
    let categories: string[] = [];

    if (filterType === "events") {
      categories = [
        "concert",
        "conference",
        "workshop",
        "sports",
        "festival",
        "exhibition",
        "party",
        "other",
      ];
    } else if (filterType === "service") {
      categories = serviceCategories;
    } else {
      categories = productCategories;
    }

    return [
      { value: "", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
      })),
    ];
  }, [filterType]);

  // Subcategory Options based on selected category
  const subcategoryOptions: DropdownOption[] = useMemo(() => {
    if (!activeFilters.category) {
      return [{ value: "", label: "All Subcategories" }];
    }

    let subcategories: string[] = [];

    if (filterType === "service") {
      subcategories =
        serviceSubCategories[
          activeFilters.category as keyof typeof serviceSubCategories
        ] || [];
    } else if (filterType === "products") {
      subcategories =
        productSubCategories[
          activeFilters.category as keyof typeof productSubCategories
        ] || [];
    }

    return [
      { value: "", label: "All Subcategories" },
      ...subcategories.map((subcat) => ({
        value: subcat,
        label: subcat.charAt(0).toUpperCase() + subcat.slice(1),
      })),
    ];
  }, [activeFilters.category, filterType]);

  // City Options from enum
  const cityOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "", label: "All Cities" },
      ...allCity.map((city) => ({
        value: city,
        label: city
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      })),
    ];
  }, []);

  // Neighbourhood Options from enum
  const neighbourhoodOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "", label: "All Neighbourhoods" },
      ...allNeighborhood.map((neighbourhood) => ({
        value: neighbourhood,
        label: neighbourhood
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      })),
    ];
  }, []);

  // Service Type Options from enum
  const serviceTypeOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "", label: "All Service Types" },
      ...serviceType.map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    ];
  }, []);

  // Event Type Options from enum
  const eventTypeOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "", label: "All Event Types" },
      ...eventType.map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    ];
  }, []);

  // Price Type Options
  const priceTypeOptions: DropdownOption[] = useMemo(
    () => [
      { value: "", label: "Any Price Type" },
      { value: "fixed", label: "Fixed Price" },
      { value: "negotiable", label: "Negotiable" },
      { value: "free", label: "Free" },
    ],
    []
  );

  // Feature Options - Keep from API as these are dynamic
  const featureOptions = useMemo(() => {
    return availableFilters?.features || [];
  }, [availableFilters?.features]);

  const offerCategoryOptions = useMemo(() => {
    return availableFilters?.categories || [];
  }, [availableFilters?.categories]);

  // Price Range Slider State
  const [priceRange, setPriceRange] = useState({
    min: activeFilters.minPrice || 0,
    max: activeFilters.maxPrice || 10000,
  });

  // Update price range when activeFilters change
  useMemo(() => {
    setPriceRange({
      min: activeFilters.minPrice || 0,
      max: activeFilters.maxPrice || 10000,
    });
  }, [activeFilters.minPrice, activeFilters.maxPrice]);

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (type: "min" | "max", value: number) => {
      setPriceRange((prev) => {
        const newRange = { ...prev, [type]: value };

        // Ensure min doesn't exceed max and vice versa
        if (type === "min" && value > prev.max) {
          newRange.max = value;
        } else if (type === "max" && value < prev.min) {
          newRange.min = value;
        }

        return newRange;
      });
    },
    []
  );

  // Apply price range to filters
  const applyPriceRange = useCallback(() => {
    if (toggleFilter) {
      toggleFilter("minPrice", priceRange.min);
      toggleFilter("maxPrice", priceRange.max);
    }
  }, [priceRange, toggleFilter]);

  // Reset price range
  const resetPriceRange = useCallback(() => {
    setPriceRange({ min: 0, max: 10000 });
    if (toggleFilter) {
      toggleFilter("minPrice", 0);
      toggleFilter("maxPrice", 0);
    }
  }, [toggleFilter]);

  // Calculate slider progress for CSS
  const sliderProgress = useMemo(() => {
    const min = 0;
    const max = 10000;
    const minPercent = ((priceRange.min - min) / (max - min)) * 100;
    const maxPercent = ((priceRange.max - min) / (max - min)) * 100;
    return { min: minPercent, max: maxPercent };
  }, [priceRange]);

  // Get today's date for date input min attribute
  const today = new Date().toISOString().split("T")[0];

  // Check if dropdown should have search functionality (more than 6 options)
  const shouldShowSearch = (options: DropdownOption[]) => options.length > 6;

  return (
    <>
      {!isDesktop && showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
      <div
        className={cn(
          "transition-all duration-300",
          isDesktop
            ? "w-80 hidden lg:block"
            : `fixed left-0 top-0 w-80 h-full bg-white z-50 overflow-y-auto ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`
        )}
      >
        <Card className="bg-white border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:bg-primary/10 rounded-lg font-medium text-sm"
              >
                Clear All
              </Button>
            </div>
            {/* Update in FilterSidebar component - Only the Offer Category section */}
            {visibleFilters.offerCategory && (
              <div>
                <button
                  onClick={() => toggleSection("offerCategory")}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h4 className="text-sm font-medium text-foreground">
                    Offer Category
                  </h4>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      expandedSections.offerCategory && "rotate-180"
                    )}
                  />
                </button>

                {expandedSections.offerCategory && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto mb-6 pr-2">
                    {getCombinedCategories(availableFilters).map((cat: any) => {
                      const isActive = activeFilters.category === cat._id;
                      const displayName = cat._id
                        .split("-")
                        .map(
                          (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
                        )
                        .join(" ");

                      return (
                        <label
                          key={cat._id}
                          className={cn(
                            "flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors cursor-pointer",
                            cat.count > 0
                              ? "hover:bg-gray-100"
                              : "hover:bg-gray-50",
                            isActive && "bg-primary/10 border border-primary/20"
                          )}
                        >
                          <input
                            type="radio"
                            name="offerCategory"
                            checked={isActive}
                            onChange={() =>
                              toggleFilter && toggleFilter("category", cat._id)
                            }
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span
                            className={cn(
                              "text-sm flex-1",
                              cat.count > 0 ? "text-gray-900" : "text-gray-600"
                            )}
                          >
                            {displayName}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full font-medium",
                              cat.count > 0
                                ? "bg-gray-900 text-white"
                                : "bg-gray-200 text-gray-500"
                            )}
                          >
                            {cat.count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              {/* Category Filter */}
              {visibleFilters.category && (
                <div>
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Category
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.category && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.category && (
                    <div className="mt-3 space-y-2">
                      <Dropdown
                        placeholder="All Categories"
                        options={categoryOptions}
                        value={activeFilters.category}
                        onValueChange={(value) => {
                          if (toggleFilter) {
                            toggleFilter("category", value);
                            // Clear subcategory when category changes
                            if (value !== activeFilters.category) {
                              toggleFilter("subcategory", "");
                            }
                          }
                        }}
                        variant="rounded"
                        className="w-full"
                        showSearch={shouldShowSearch(categoryOptions)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Subcategory Filter */}
              {visibleFilters.subcategory && activeFilters.category && (
                <div>
                  <button
                    onClick={() => toggleSection("subcategory")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Subcategory
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.subcategory && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.subcategory && (
                    <div className="mt-3 space-y-2">
                      <Dropdown
                        placeholder="All Subcategories"
                        options={subcategoryOptions}
                        value={activeFilters.subcategory}
                        onValueChange={(value) => {
                          if (toggleFilter) {
                            toggleFilter("subcategory", value);
                          }
                        }}
                        variant="rounded"
                        className="w-full"
                        showSearch={shouldShowSearch(subcategoryOptions)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Service Type Filter */}
              {visibleFilters.serviceType && (
                <div>
                  <button
                    onClick={() => toggleSection("serviceType")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Service Type
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.serviceType && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.serviceType && (
                    <div className="mt-3 space-y-2 max-h-48 p-3 overflow-y-auto">
                      {serviceTypeOptions
                        .filter((opt) => opt.value)
                        .map((service) => (
                          <label
                            key={service.value}
                            className="flex items-center space-x-3 cursor-pointer py-1"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.serviceType?.includes(
                                service.value
                              )}
                              onChange={() => {
                                if (toggleFilter) {
                                  toggleFilter("serviceType", service.value);
                                }
                              }}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-foreground flex-1">
                              {service.label}
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Event Type Filter */}
              {visibleFilters.eventType && filterType === "events" && (
                <div>
                  <button
                    onClick={() => toggleSection("eventType")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Event Type
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.eventType && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.eventType && (
                    <div className="mt-3 space-y-2">
                      <Dropdown
                        placeholder="All Event Types"
                        options={eventTypeOptions}
                        value={activeFilters.eventType || ""}
                        onValueChange={(value) => {
                          if (toggleFilter) {
                            toggleFilter("eventType", value);
                          }
                        }}
                        variant="rounded"
                        className="w-full"
                        showSearch={shouldShowSearch(eventTypeOptions)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Date Range Filter for Events */}
              {visibleFilters.date && filterType === "events" && (
                <div>
                  <button
                    onClick={() => toggleSection("date")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Event Date
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.date && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.date && (
                    <div className="mt-3 space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={activeFilters.startDate || ""}
                          onChange={(e) => {
                            if (toggleFilter) {
                              toggleFilter("startDate", e.target.value);
                            }
                          }}
                          min={today}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={activeFilters.endDate || ""}
                          onChange={(e) => {
                            if (toggleFilter) {
                              toggleFilter("endDate", e.target.value);
                            }
                          }}
                          min={activeFilters.startDate || today}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location Filter */}
              {(visibleFilters.city || visibleFilters.neighbourhood) && (
                <div>
                  <button
                    onClick={() => toggleSection("location")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Location
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.location && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.location && (
                    <div className="mt-3 space-y-4">
                      {visibleFilters.city && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-2 block">
                            City
                          </label>
                          <Dropdown
                            placeholder="All Cities"
                            options={cityOptions}
                            value={activeFilters.city}
                            onValueChange={(value) => {
                              if (toggleFilter) {
                                toggleFilter("city", value);
                              }
                            }}
                            variant="rounded"
                            className="w-full"
                            showSearch={shouldShowSearch(cityOptions)}
                          />
                        </div>
                      )}

                      {visibleFilters.neighbourhood && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-2 block">
                            Neighbourhood
                          </label>
                          <Dropdown
                            placeholder="All Neighbourhoods"
                            options={neighbourhoodOptions}
                            value={activeFilters.neighbourhood}
                            onValueChange={(value) => {
                              if (toggleFilter) {
                                toggleFilter("neighbourhood", value);
                              }
                            }}
                            variant="rounded"
                            className="w-full"
                            showSearch={shouldShowSearch(neighbourhoodOptions)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Rating Filter */}
              {visibleFilters.rating && (
                <div>
                  <button
                    onClick={() => toggleSection("rating")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Minimum Rating
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.rating && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.rating && (
                    <div className="mt-3 space-y-3">
                      {/* Star Rating Buttons - Fixed order from left to right */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => {
                              if (toggleFilter) {
                                toggleFilter("minRating", rating);
                              }
                            }}
                            className={cn(
                              "p-1 transition-all duration-200 transform hover:scale-110",
                              activeFilters.minRating &&
                                rating <= activeFilters.minRating
                                ? "text-yellow-500 scale-110"
                                : "text-gray-300 hover:text-yellow-400"
                            )}
                          >
                            <Star
                              className={cn(
                                "w-6 h-6",
                                activeFilters.minRating &&
                                  rating <= activeFilters.minRating &&
                                  "fill-current"
                              )}
                            />
                          </button>
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {activeFilters.minRating
                            ? `${activeFilters.minRating}+ stars`
                            : ""}
                        </span>
                      </div>

                      {/* Any Rating Option */}
                      <label className="flex items-center space-x-3 cursor-pointer pt-2 border-t">
                        <input
                          type="radio"
                          name="rating"
                          checked={!activeFilters.minRating}
                          onChange={() => {
                            if (toggleFilter) {
                              toggleFilter("minRating", undefined);
                            }
                          }}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                          Any Rating
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
              {/* Price Range Filter */}
              {visibleFilters.price && (
                <div>
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Price Range
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.price && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.price && (
                    <div className="mt-3 space-y-4">
                      {/* Price Range Slider */}
                      <div className="space-y-4">
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          {/* Slider Track */}
                          <div
                            className="absolute h-2 bg-primary rounded-full"
                            style={{
                              left: `${sliderProgress.min}%`,
                              right: `${100 - sliderProgress.max}%`,
                            }}
                          />

                          {/* Min Price Handle */}
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange.min}
                            onChange={(e) =>
                              handlePriceRangeChange(
                                "min",
                                parseInt(e.target.value)
                              )
                            }
                            className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                          />
                          <div
                            className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg transform -translate-y-1 z-10"
                            style={{ left: `${sliderProgress.min}%` }}
                          />

                          {/* Max Price Handle */}
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange.max}
                            onChange={(e) =>
                              handlePriceRangeChange(
                                "max",
                                parseInt(e.target.value)
                              )
                            }
                            className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                          />
                          <div
                            className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg transform -translate-y-1 z-10"
                            style={{ left: `${sliderProgress.max}%` }}
                          />
                        </div>

                        {/* Price Display */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-foreground font-medium">
                            {priceRange.min.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground">to</div>
                          <div className="text-foreground font-medium">
                            {priceRange.max.toLocaleString()}
                          </div>
                        </div>

                        {/* Price Inputs */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Min Price
                            </label>
                            <input
                              type="number"
                              value={priceRange.min}
                              onChange={(e) =>
                                handlePriceRangeChange(
                                  "min",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Max Price
                            </label>
                            <input
                              type="number"
                              value={priceRange.max}
                              onChange={(e) =>
                                handlePriceRangeChange(
                                  "max",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="10000"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={applyPriceRange}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm py-2 rounded-lg"
                          >
                            Apply Price
                          </Button>
                          <Button
                            onClick={resetPriceRange}
                            variant="outline"
                            className="flex-1 text-sm py-2 rounded-lg"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Type Filter */}
              {visibleFilters.priceType && (
                <div>
                  <button
                    onClick={() => toggleSection("priceType")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Price Type
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.priceType && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.priceType && (
                    <div className="mt-3 space-y-2">
                      <Dropdown
                        placeholder="Any Price Type"
                        options={priceTypeOptions}
                        value={activeFilters.priceType || ""}
                        onValueChange={(value) => {
                          if (toggleFilter) {
                            toggleFilter("priceType", value);
                          }
                        }}
                        variant="rounded"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Features Filter - Keep dynamic from API */}
              {visibleFilters.features && featureOptions.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection("features")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      Features & Amenities
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.features && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.features && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {featureOptions.map((feature: any) => (
                        <label
                          key={feature._id}
                          className="flex items-center space-x-3 cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters.features?.includes(
                              feature._id
                            )}
                            onChange={() => {
                              if (toggleFilter) {
                                toggleFilter("features", feature._id);
                              }
                            }}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-foreground flex-1">
                            {feature._id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({feature.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              className="w-full mt-8 bg-primary hover:bg-primary/90 rounded-full text-white font-medium py-3"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
