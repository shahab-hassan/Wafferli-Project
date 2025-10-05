// marketplace-hero.tsx (modified)
"use client"
import { ShoppingBag, Megaphone } from "lucide-react" // modified: add Megaphone
import { useTranslations } from "next-intl"
import { MarketplaceSearchBar } from "./marketplace-search-bar"
import { useRole } from "@/contexts/roleContext"; 


interface MarketplaceHeroProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  onSearch?: (data: any) => void
  products: Product[]
  services: Service[]
}

export function MarketplaceHero({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onSearch,
  products,
  services,
}: MarketplaceHeroProps) {
  const t = useTranslations()

  const { role } = useRole();

  // compute active ads
  const activeProducts = products.filter(p => p.inStock);
  const activeServices = services; // assuming all services are active
  const totalActive = activeProducts.length + activeServices.length;

  return (
    // Break out to full viewport width
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-10">
      <div className="relative bg-gradient-to-r from-primary to-secondary">
        {/* Content */}
        <div className="relative z-10 text-center py-16 px-6 sm:py-20 sm:px-8">
          {/* Marketplace Badge + Active Ads Badge */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <ShoppingBag className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">{t("marketplace.hero.badge")}</span>
            </div>
            { role ==='seller' && <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Megaphone className="w-4 h-4 text-white mr-2" /> {/* new: add icon */}
              <span className="text-white text-sm font-medium">{totalActive} {t("marketplace.hero.activeAds")}</span>
            </div> }
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {t("marketplace.hero.title")} <span className="text-tertiary">{t("marketplace.hero.titleHighlight")}</span>{" "}
            {t("marketplace.hero.titleSuffix")}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-pretty">
            {t("marketplace.hero.subtitle")}
          </p>

          <MarketplaceSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onSearch={onSearch}
            products={products}
            services={services}
          />
        </div>
      </div>
    </div>
  )
}