"use client"

import { Card, CardContent } from "@/components/common/shadecn-card"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "react-responsive"
import { Dropdown, type DropdownOption } from "../common/dropdown"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ActiveFilters {
  eventType: string
  location: string
  distance: number[]
  priceRange: number[]
  discountRange: number[]
  rating: number
  types: string[]
}

interface FilterSidebarProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  activeFilters: ActiveFilters
  toggleFilter: (type: string, value: any) => void
  clearAllFilters: () => void
  getActiveFilterCount: () => number
}

export default function EventFilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  getActiveFilterCount,
}: FilterSidebarProps) {
  const t = useTranslations()
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    listingType: true,
  })

  const locationOptions: DropdownOption[] = [
    { value: "", label: t("events.all_areas") },
    { value: "kuwait-city", label: t("events.kuwait_city") },
    { value: "hawalli", label: t("events.hawalli") },
    { value: "farwaniya", label: t("events.farwaniya") },
    { value: "ahmadi", label: t("events.ahmadi") },
    { value: "jahra", label: t("events.jahra") },
    { value: "mubarak-al-kabeer", label: t("events.mubarak_al_kabeer") },
    { value: "salmiya", label: t("events.salmiya") },
    { value: "fahaheel", label: t("events.fahaheel") },
  ]

  const eventTypeOptions: DropdownOption[] = [
    { value: "", label: t("events.all_types") },
    { value: "concert", label: t("events.types.concert") },
    { value: "festival", label: t("events.types.festival") },
    { value: "workshop", label: t("events.types.workshop") },
    { value: "conference", label: t("events.types.conference") },
    { value: "sports", label: t("events.types.sports") },
    { value: "art-exhibition", label: t("events.types.art_exhibition") },
    { value: "theater", label: t("events.types.theater") },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <>
      {!isDesktop && showFilters && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
      )}
      <div
        className={cn(
          "transition-all duration-300",
          isDesktop
            ? "w-80 hidden lg:block"
            : `fixed left-0 top-0 w-80 h-full bg-white z-50 overflow-y-auto ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`,
        )}
      >
        {!isDesktop && (
          <button onClick={() => setShowFilters(false)} className="absolute top-4 right-4 p-2">
            <X className="w-6 h-6 text-grey-2" />
          </button>
        )}
        <Card className="bg-white border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">{t("events.filters")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:bg-primary/10 rounded-lg font-medium text-sm"
              >
                {t("events.clear_all")}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">{t("events.location")}</h4>
                <Dropdown
                  placeholder={t("events.all_areas")}
                  options={locationOptions}
                  value={activeFilters.location}
                  onValueChange={(value) => toggleFilter("location", value)}
                  variant="rounded"
                  className="w-full"
                />
                <div className="mt-4 space-y-2">
                  {locationOptions.slice(1).map((location) => (
                    <label key={location.value} className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="location"
                          value={location.value}
                          checked={activeFilters.location === location.value}
                          onChange={() => toggleFilter("location", location.value)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            activeFilters.location === location.value
                              ? "border-primary bg-primary"
                              : "border-gray-300",
                          )}
                        >
                          {activeFilters.location === location.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-foreground">{location.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Event Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">{t("events.event_type")}</h4>
                <Dropdown
                  placeholder={t("events.all_types")}
                  options={eventTypeOptions}
                  value={activeFilters.eventType}
                  onValueChange={(value) => toggleFilter("eventType", value)}
                  variant="rounded"
                  className="w-full"
                />
              </div>

              {/* Features & Amenities */}
              <div>
                <button
                  onClick={() => toggleSection("features")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-sm font-medium text-foreground">{t("events.features_amenities")}</h4>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", expandedSections.features && "rotate-180")}
                  />
                </button>
                {expandedSections.features && (
                  <div className="mt-3 space-y-3">
                    {[
                      { key: "family_friendly", label: t("events.family_friendly") },
                      { key: "parking_available", label: t("events.parking_available") },
                      { key: "wheelchair_accessible", label: t("events.wheelchair_accessible") },
                      { key: "indoor", label: t("events.indoor") },
                      { key: "free_entry", label: t("events.free_entry") },
                    ].map((feature) => (
                      <label key={feature.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.types.includes(feature.key)}
                          onChange={() => toggleFilter("types", feature.key)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Listing Type */}
              <div>
                <button
                  onClick={() => toggleSection("listingType")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-sm font-medium text-foreground">{t("events.listing_type")}</h4>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", expandedSections.listingType && "rotate-180")}
                  />
                </button>
                {expandedSections.listingType && (
                  <div className="mt-3 space-y-3">
                    {[
                      { key: "sponsored_locations", label: t("events.sponsored_locations") },
                      { key: "verified_reviews", label: t("events.verified_reviews") },
                      { key: "trending", label: t("events.trending") },
                    ].map((type) => (
                      <label key={type.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.types?.includes(type.key) || false}
                          onChange={() => toggleFilter("types", type.key)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{type.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full mt-8 bg-primary hover:bg-primary/90 rounded-full text-white font-medium py-3">
              {t("events.apply_filters")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}