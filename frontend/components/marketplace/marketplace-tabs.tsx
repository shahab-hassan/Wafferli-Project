// MarketplaceTabs.tsx
"use client"
import { ShoppingCart, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface MarketplaceTabsProps {
  activeTab: "products" | "services"
  onTabChange: (tab: "products" | "services") => void
}

export function MarketplaceTabs({ activeTab, onTabChange }: MarketplaceTabsProps) {
  const t = useTranslations()

  return (
    <div className="flex justify-center mb-6 md:mb-8 px-4">
      <div className="bg-grey-5 rounded-full p-1 flex">
        <button
          onClick={() => onTabChange("products")}
          className={cn(
            "flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
            activeTab === "products" ? "bg-white text-primary shadow-sm" : "text-grey-2 hover:text-grey-1",
          )}
        >
          <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          {t("marketplace.tabs.shopProducts")}
        </button>
        <button
          onClick={() => onTabChange("services")}
          className={cn(
            "flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
            activeTab === "services" ? "bg-white text-primary shadow-sm" : "text-grey-2 hover:text-grey-1",
          )}
        >
          <Wrench className="w-3.5 h-3.5 md:w-4 md:h-4" />
          {t("marketplace.tabs.bookServices")}
        </button>
      </div>
    </div>
  )
}
