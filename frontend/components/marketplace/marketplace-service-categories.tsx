// MarketplaceServiceCategories.tsx
"use client"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Briefcase, Home } from "lucide-react"

interface MarketplaceServiceCategoriesProps {
  activeServiceCategory: string
  onServiceCategoryChange: (category: string) => void
}

export function MarketplaceServiceCategories({
  activeServiceCategory,
  onServiceCategoryChange,
}: MarketplaceServiceCategoriesProps) {
  const t = useTranslations()

  const serviceCategories = [
    {
      id: "professional",
      name: t("marketplace.services.categories.professional"),
      description: t("marketplace.services.categories.professionalDesc"),
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "home-personal",
      name: t("marketplace.services.categories.homePersonal"),
      description: t("marketplace.services.categories.homePersonalDesc"),
      icon: Home,
      color: "bg-green-50 text-green-600 border-green-200",
    },
  ]

  return (
    <div className="mb-6 md:mb-8 px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              onClick={() => onServiceCategoryChange(category.id)}
              className={cn(
                "flex items-center p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-200 text-left hover:shadow-md flex-1",
                activeServiceCategory === category.id
                  ? "border-primary bg-primary text-white shadow-lg"
                  : "border-grey-5 bg-white hover:border-grey-4",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0",
                  activeServiceCategory === category.id ? "bg-white/20" : category.color,
                )}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-0.5 md:mb-1">{category.name}</h3>
                <p className={cn(
                  "text-xs sm:text-sm leading-tight", 
                  activeServiceCategory === category.id ? "text-white/80" : "text-grey-2"
                )}>
                  {category.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}