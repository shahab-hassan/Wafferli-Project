"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/common/button";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { Dropdown, type DropdownOption } from "../common/dropdown";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";

interface ActiveFilters {
  categories: string[];
  location: string;
  distance: number[];
  priceRange: number[];
  discountRange: number[];
  rating: number;
  types: string[];
}

interface FilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: ActiveFilters;
  toggleFilter: (type: string, value: any) => void;
  clearAllFilters: () => void;
  getActiveFilterCount: () => number;
  visibleSections: {
    location?: boolean;
    categories?: boolean;
    features?: boolean;
    listingType?: boolean;
  };
}

export default function FilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  getActiveFilterCount,
  visibleSections = {
    location: true,
    categories: true,
    features: true,
    listingType: true,
  },
}: FilterSidebarProps) {
  const t = useTranslations();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    features: true,
    listingType: true,
  });

  const dispatch = useDispatch();

  const locationOptions: DropdownOption[] = useMemo(
    () => [
      { value: "", label: t("explore.all_areas") },
      { value: "kuwait-city", label: t("explore.kuwait_city") },
      { value: "hawalli", label: t("explore.hawalli") },
      { value: "farwaniya", label: t("explore.farwaniya") },
      { value: "ahmadi", label: t("explore.ahmadi") },
      { value: "jahra", label: t("explore.jahra") },
      { value: "mubarak-al-kabeer", label: t("explore.mubarak_al_kabeer") },
      { value: "salmiya", label: t("explore.salmiya") },
      { value: "fahaheel", label: t("explore.fahaheel") },
    ],
    [t]
  );

  const features = useMemo(
    () => [
      { key: "family_friendly", label: t("explore.family_friendly") },
      { key: "parking_available", label: t("explore.parking_available") },
      {
        key: "wheelchair_accessible",
        label: t("explore.wheelchair_accessible"),
      },
      { key: "indoor", label: t("explore.indoor") },
      { key: "free_entry", label: t("explore.free_entry") },
    ],
    [t]
  );

  const listingTypes = useMemo(
    () => [
      { key: "sponsored_locations", label: t("explore.sponsored_locations") },
      { key: "verified_reviews", label: t("explore.verified_reviews") },
      { key: "trending", label: t("explore.trending") },
    ],
    [t]
  );

  const categories = useMemo(
    () => [
      {
        name: "Restaurants",
        icon: "🍽️",
        color: "bg-blue-100 text-blue-600 border-blue-200",
      },
      {
        name: "Cafes",
        icon: "☕",
        color: "bg-green-100 text-green-600 border-green-200",
      },
      {
        name: "Parks",
        icon: "🌳",
        color: "bg-teal-100 text-teal-600 border-teal-200",
      },
      {
        name: "Museums",
        icon: "🏛️",
        color: "bg-purple-100 text-purple-600 border-purple-200",
      },
      {
        name: "Beaches",
        icon: "🏖️",
        color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      },
    ],
    []
  );

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    []
  );

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
        {!isDesktop && (
          <button
            onClick={() => setShowFilters(false)}
            className="absolute top-4 right-4 p-2"
          >
            <X className="w-6 h-6 text-grey-2" />
          </button>
        )}
        <Card className="bg-white border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {t("explore.filters")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:bg-primary/10 rounded-lg font-medium text-sm"
              >
                {t("explore.clear_all")}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              {visibleSections.location && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    {t("explore.location")}
                  </h4>
                  <Dropdown
                    placeholder={t("explore.all_areas")}
                    options={locationOptions}
                    value={activeFilters.location}
                    onValueChange={(value) => toggleFilter("location", value)}
                    variant="rounded"
                    className="w-full"
                  />
                  <div className="mt-4 space-y-2">
                    {locationOptions.slice(1).map((location) => (
                      <label
                        key={location.value}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="location"
                            value={location.value}
                            checked={activeFilters.location === location.value}
                            onChange={() =>
                              toggleFilter("location", location.value)
                            }
                            className="sr-only"
                          />
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              activeFilters.location === location.value
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            )}
                          >
                            {activeFilters.location === location.value && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-foreground">
                          {location.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {visibleSections.categories && (
                <div>
                  <button
                    onClick={() => toggleSection("categories")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      {t("explore.explore_categories")}
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.categories && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.categories && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() =>
                            toggleFilter("categories", category.name)
                          }
                          className={cn(
                            "px-3 py-2 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1",
                            activeFilters.categories.includes(category.name)
                              ? category.color
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          )}
                        >
                          <span>{category.icon}</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Features & Amenities */}
              {visibleSections.features && (
                <div>
                  <button
                    onClick={() => toggleSection("features")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      {t("explore.features_amenities")}
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.features && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.features && (
                    <div className="mt-3 space-y-3">
                      {features.map((feature) => (
                        <label
                          key={feature.key}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters.categories.includes(
                              feature.key
                            )}
                            onChange={() =>
                              toggleFilter("categories", feature.key)
                            }
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">
                            {feature.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Listing Type */}
              {visibleSections.listingType && (
                <div>
                  <button
                    onClick={() => toggleSection("listingType")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground">
                      {t("explore.listing_type")}
                    </h4>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections.listingType && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.listingType && (
                    <div className="mt-3 space-y-3">
                      {listingTypes.map((type) => (
                        <label
                          key={type.key}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              activeFilters.types?.includes(type.key) || false
                            }
                            onChange={() => toggleFilter("types", type.key)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button className="w-full mt-8 bg-primary hover:bg-primary/90 rounded-full text-white font-medium py-3">
              {t("explore.apply_filters")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
