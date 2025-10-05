// MarketplaceSubcategories.tsx
"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useRef, useState, useEffect } from "react"

interface MarketplaceSubcategoriesProps {
  activeSubcategory: string
  onSubcategoryChange: (subcategory: string) => void
}

export function MarketplaceSubcategories({ activeSubcategory, onSubcategoryChange }: MarketplaceSubcategoriesProps) {
  const t = useTranslations()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const subcategories = [
    { id: "all", name: t("marketplace.subcategories.allElectronics"), count: 324 },
    { id: "mobile", name: t("marketplace.subcategories.mobileDevices"), count: 324 },
    { id: "accessories", name: t("marketplace.subcategories.mobileAccessories"), count: 324 },
    { id: "computers", name: t("marketplace.subcategories.desktopComputers"), count: 324 },
    { id: "laptops", name: t("marketplace.subcategories.laptopsNotebooks"), count: 324 },
    { id: "computer-accessories", name: t("marketplace.subcategories.computerAccessories"), count: 324 },
  ]

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollButtons)
      return () => scrollElement.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 120 : 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="mb-6 md:mb-8 relative border-t border-b border-grey-4 py-4 md:py-6 bg-grey-6/30">
      <div className="flex items-center">
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-1 md:left-0 z-10 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200",
            !canScrollLeft && "opacity-50 cursor-not-allowed",
          )}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-grey-2" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide px-8 md:px-12 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => onSubcategoryChange(subcategory.id)}
              className={cn(
                "flex flex-col items-center px-2 sm:px-4 md:px-6 py-2 md:py-3 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                activeSubcategory === subcategory.id
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-grey-4 bg-white hover:border-grey-3 text-grey-1 hover:shadow-sm",
              )}
            >
              <span className="text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 md:mb-1 px-1">{subcategory.name}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs opacity-75">
                {subcategory.count} {t("marketplace.productsCount")}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-1 md:right-0 z-10 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200",
            !canScrollRight && "opacity-50 cursor-not-allowed",
          )}
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-grey-2" />
        </button>
      </div>
    </div>
  )
}