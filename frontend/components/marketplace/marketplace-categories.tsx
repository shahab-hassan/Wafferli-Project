// MarketplaceCategories.tsx
"use client"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface MarketplaceCategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function MarketplaceCategories({ activeCategory, onCategoryChange }: MarketplaceCategoriesProps) {
  const t = useTranslations()

  const categories = [
    { id: "all", name: t("marketplace.categories.allProducts"), icon: "/categories/all-products.jpg" },
    { id: "electronics", name: t("marketplace.categories.electronics"), icon: "/categories/electronics.jpg" },
    { id: "home", name: t("marketplace.categories.homeGarden"), icon: "/categories/home-garden.jpg" },
    { id: "fashion", name: t("marketplace.categories.fashionApparel"), icon: "/categories/fashion-apparel.jpg" },
    { id: "health", name: t("marketplace.categories.healthBeauty"), icon: "/categories/health-beauty.jpg" },
    { id: "sports", name: t("marketplace.categories.sportsRecreation"), icon: "/categories/sports-recreation.jpg" },
    { id: "automotive", name: t("marketplace.categories.automotive"), icon: "/categories/automotive.jpg" },
    { id: "other", name: t("marketplace.categories.other"), icon: "/categories/other.jpg" },
  ]

  return (
    <div className="mb-6 md:mb-8 px-4 md:px-0">
      {/* Mobile: 3 columns, Tablet: 4 columns, Desktop: flexible wrap */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-wrap gap-3 md:gap-4 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 hover:shadow-md",
              "min-w-0 lg:min-w-[110px]", // Allow shrinking on mobile
              activeCategory === category.id
                ? "border-primary bg-primary text-white shadow-lg"
                : "border-grey-5 bg-white hover:border-grey-4 text-grey-1 hover:bg-grey-6",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1.5 md:mb-2 overflow-hidden flex-shrink-0",
                activeCategory === category.id ? "bg-white/20" : "bg-grey-6",
              )}
            >
              <img
                src={category.icon || "/placeholder.svg?height=32&width=32"}
                alt={category.name}
                className="w-5 h-5 md:w-8 md:h-8 object-cover rounded-full"
              />
            </div>
            <span className="text-[10px] md:text-xs font-medium text-center leading-tight line-clamp-2 min-h-[24px] md:min-h-[32px] flex items-center">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}