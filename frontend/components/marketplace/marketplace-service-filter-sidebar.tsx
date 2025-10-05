"use client"

import type React from "react"

import { Card, CardContent } from "@/components/common/shadecn-card"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"
import { Dropdown, type DropdownOption } from "../common/dropdown"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface ActiveServiceFilters {
  location: string
  serviceCategories: string[]
  priceRange: number[]
  rating: number
}

interface MarketplaceServiceFilterSidebarProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  activeFilters: ActiveServiceFilters
  toggleFilter: (type: string, value: any) => void
  clearAllFilters: () => void
  getActiveFilterCount: () => number
  activeServiceCategory: string
}

export default function MarketplaceServiceFilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  getActiveFilterCount,
  activeServiceCategory,
}: MarketplaceServiceFilterSidebarProps) {
  const t = useTranslations()
  const [isDesktop, setIsDesktop] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    serviceCategories: true,
    rating: true,
  })

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)

    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const minPrice = 15
  const maxPrice = 500
  const [tempRange, setTempRange] = useState(activeFilters.priceRange)

  useEffect(() => {
    setTempRange(activeFilters.priceRange)
  }, [activeFilters.priceRange])

  const handleMouseDown = (type: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(type)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const value = Math.round(minPrice + percentage * (maxPrice - minPrice))

    if (isDragging === "min") {
      setTempRange([Math.min(value, tempRange[1] - 10), tempRange[1]])
    } else {
      setTempRange([tempRange[0], Math.max(value, tempRange[0] + 10)])
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      toggleFilter("priceRange", tempRange)
      setIsDragging(null)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, tempRange])

  const locationOptions: DropdownOption[] = [
    { value: "", label: t("marketplace.filters.allAreas") },
    { value: "kuwait-city", label: t("marketplace.filters.kuwaitCity") },
    { value: "hawalli", label: t("marketplace.filters.hawalli") },
    { value: "farwaniya", label: t("marketplace.filters.farwaniya") },
    { value: "ahmadi", label: t("marketplace.filters.ahmadi") },
    { value: "jahra", label: t("marketplace.filters.jahra") },
    { value: "mubarak-al-kabeer", label: t("marketplace.filters.mubarakAlKabeer") },
    { value: "salmiya", label: t("marketplace.filters.salmiya") },
    { value: "fahaheel", label: t("marketplace.filters.fahaheel") },
  ]

  const getServiceCategories = () => {
    if (activeServiceCategory === "professional") {
      return [
        { key: "medical", label: t("marketplace.services.subcategories.medical") },
        { key: "legal", label: t("marketplace.services.subcategories.legal") },
        { key: "consulting", label: t("marketplace.services.subcategories.consulting") },
        { key: "accounting", label: t("marketplace.services.subcategories.accounting") },
        { key: "marketing", label: t("marketplace.services.subcategories.marketing") },
        { key: "design", label: t("marketplace.services.subcategories.design") },
      ]
    } else {
      return [
        { key: "cleaning", label: t("marketplace.services.subcategories.cleaning") },
        { key: "repair", label: t("marketplace.services.subcategories.repair") },
        { key: "beauty", label: t("marketplace.services.subcategories.beauty") },
        { key: "fitness", label: t("marketplace.services.subcategories.fitness") },
        { key: "tutoring", label: t("marketplace.services.subcategories.tutoring") },
        { key: "pet-care", label: t("marketplace.services.subcategories.petCare") },
      ]
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const getSliderPosition = (value: number) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100
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
        <Card className="bg-white border rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">{t("marketplace.filters.title")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:bg-primary/10 rounded-lg font-medium text-sm"
              >
                {t("marketplace.filters.clearAll")}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <button
                  onClick={() => toggleSection("location")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-sm font-medium text-foreground">{t("marketplace.filters.location")}</h4>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", expandedSections.location && "rotate-180")}
                  />
                </button>
                {expandedSections.location && (
                  <div className="mt-3">
                    <Dropdown
                      placeholder={t("marketplace.filters.yourLocation")}
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
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">{t("marketplace.filters.priceRange")}</h4>
                <div className="px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-grey-2">{tempRange[0]} KD</span>
                    <span className="text-sm text-grey-2">{tempRange[1]} KD</span>
                  </div>
                  <div ref={sliderRef} className="relative h-2 bg-grey-5 rounded-full cursor-pointer">
                    {/* Active range */}
                    <div
                      className="absolute h-2 bg-primary rounded-full"
                      style={{
                        left: `${getSliderPosition(tempRange[0])}%`,
                        width: `${getSliderPosition(tempRange[1]) - getSliderPosition(tempRange[0])}%`,
                      }}
                    />
                    {/* Min handle */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow cursor-grab active:cursor-grabbing"
                      style={{ left: `${getSliderPosition(tempRange[0])}%`, marginLeft: "-8px" }}
                      onMouseDown={handleMouseDown("min")}
                    />
                    {/* Max handle */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow cursor-grab active:cursor-grabbing"
                      style={{ left: `${getSliderPosition(tempRange[1])}%`, marginLeft: "-8px" }}
                      onMouseDown={handleMouseDown("max")}
                    />
                  </div>
                </div>
              </div>

              {/* Service Categories */}
              <div>
                <button
                  onClick={() => toggleSection("serviceCategories")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-sm font-medium text-foreground">
                    {t("marketplace.services.filters.serviceCategories")}
                  </h4>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", expandedSections.serviceCategories && "rotate-180")}
                  />
                </button>
                {expandedSections.serviceCategories && (
                  <div className="mt-3 space-y-3">
                    {getServiceCategories().map((category) => (
                      <label key={category.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.serviceCategories.includes(category.key)}
                          onChange={() => toggleFilter("serviceCategories", category.key)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{category.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimum Rating */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">{t("marketplace.filters.minimumRating")}</h4>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => toggleFilter("rating", star)}
                      className={cn(
                        "w-6 h-6 text-lg transition-colors",
                        star <= (activeFilters.rating || 0) ? "text-warning" : "text-grey-4 hover:text-warning/50",
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 bg-primary hover:bg-primary/90 rounded-full text-white font-medium py-3">
              {t("marketplace.filters.applyFilters")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
