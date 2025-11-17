import { Card, CardContent } from "@/components/common/shadecn-card";
import { Badge } from "@/components/common/badge";
import { EnhancedSlider } from "@/components/common/enhanced-slider";
import { EnhancedCheckbox } from "@/components/common/enhanced-checkbox";
import { Star, Clock, Zap, Flame, Sparkles, X } from "lucide-react";
import { Button } from "@/components/common/button";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { Dropdown, DropdownOption } from "../common/dropdown";
import { cn } from "@/lib/utils";

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
}

export default function FilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  getActiveFilterCount,
}: FilterSidebarProps) {
  const t = useTranslations();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const categories = [
    { name: t("restaurants"), count: 89 },
    { name: t("hotels"), count: 23 },
    { name: t("cafes"), count: 45 },
    { name: t("salons"), count: 67 },
    { name: t("entertainment"), count: 34 },
    { name: t("shopping"), count: 78 },
    { name: t("health_beauty"), count: 56 },
    { name: t("automotive"), count: 12 },
  ];

  const offerTypes = [
    {
      id: "new",
      label: t("new_arrivals"),
      icon: <Sparkles className="w-4 h-4" />,
      badge: t("new"),
    },
    {
      id: "popular",
      label: t("most_popular"),
      icon: <Flame className="w-4 h-4" />,
      badge: "🔥",
    },
    {
      id: "expiring",
      label: t("expiring_soon"),
      icon: <Clock className="w-4 h-4" />,
      badge: "⏰",
    },
    {
      id: "flash",
      label: t("flash_deals"),
      icon: <Zap className="w-4 h-4" />,
      badge: "⚡",
    },
  ];

  const locationOptions: DropdownOption[] = [
    { value: "", label: t("all_areas") },
    { value: "kuwait-city", label: t("kuwait_city") },
    { value: "hawalli", label: t("hawalli") },
    { value: "farwaniya", label: t("farwaniya") },
    { value: "salmiya", label: t("salmiya") },
    { value: "ahmadi", label: t("ahmadi") },
    { value: "jahra", label: t("jahra") },
  ];

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
            : `fixed left-0 top-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto ${
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
        <Card className="border-border bg-white">
          <CardContent className="p-4 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-h6 text-foreground font-semibold">
                {t("filters")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:bg-primary/10 rounded-lg font-medium"
              >
                {t("clear_all")}
              </Button>
            </div>

            <div className="space-y-8">
              {/* Category Filters */}
              {/* <div>
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("categories")}
                </h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center space-x-3"
                    >
                      <EnhancedCheckbox
                        id={category.name}
                        checked={activeFilters.categories.includes(
                          category.name
                        )}
                        onCheckedChange={() =>
                          toggleFilter("categories", category.name)
                        }
                        className="rounded-md"
                      />
                      <label
                        htmlFor={category.name}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <span className="text-small-regular text-muted-foreground">
                          {category.name}
                        </span>
                        <Badge className="bg-grey-5 rounded-full px-3 py-1 text-xs font-medium ml-auto">
                          {category.count}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Location Filter */}
              <div>
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("location")}
                </h4>
                <Dropdown
                  placeholder={t("all_areas")}
                  options={locationOptions}
                  value={activeFilters.location}
                  onValueChange={(value) => toggleFilter("location", value)}
                  variant="rounded"
                  className="w-full"
                />
                {/* <div className="mt-4">
                  <label className="text-small-regular text-muted-foreground mb-3 block">
                    {t("distance")}: {activeFilters.distance[0]} {t("km")}
                  </label>
                  <EnhancedSlider
                    value={activeFilters.distance}
                    onValueChange={(value) => toggleFilter("distance", value)}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div> */}
              </div>

              {/* Type Filters */}
              <div className="w-full">
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("deal_types")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {offerTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleFilter("types", type.id)}
                      className={`p-4 rounded-[24px] border-2 transition-all duration-300 text-center ${
                        activeFilters.types.includes(type.id)
                          ? "border-primary bg-accent text-primary"
                          : "border-border hover:border-muted hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col justify-center items-center space-y-1">
                        {type.icon}
                        <span className="text-smaller-regular">
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("price_range")}: {activeFilters.priceRange[0]} -{" "}
                  {activeFilters.priceRange[1]} {t("kd")}
                </h4>
                <EnhancedSlider
                  value={activeFilters.priceRange}
                  onValueChange={(value) => toggleFilter("priceRange", value)}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Discount Range */}
              <div>
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("minimum_discount")}: {activeFilters.discountRange[0]}%
                </h4>
                <EnhancedSlider
                  value={activeFilters.discountRange}
                  onValueChange={(value) =>
                    toggleFilter("discountRange", value)
                  }
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-normal-semibold text-foreground mb-4">
                  {t("minimum_rating")}
                </h4>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => toggleFilter("rating", rating)}
                      className={`p-2 rounded-full transition-colors ${
                        activeFilters.rating >= rating
                          ? "text-tertiary"
                          : "text-grey-4 hover:text-grey-3"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-full text-white font-medium py-4">
              {t("apply_filters")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
