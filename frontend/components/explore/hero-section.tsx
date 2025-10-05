"use client"
import { Search, MapPin } from "lucide-react"
import { TextField } from "@/components/common/text-field"
import { useTranslations } from "next-intl"

interface HeroSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function HeroSection({ searchQuery, setSearchQuery }: HeroSectionProps) {
  const t = useTranslations()

  return (
    // Break out to full viewport width
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-10">
      <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Top Left - explore1.png */}
          <img
            src="/explore1.png"
            alt="Kuwait Architecture"
            className="absolute -top-8 left-4 w-40 h-32 sm:w-48 sm:h-36 lg:w-56 lg:h-40 rounded-2xl object-cover opacity-90 transform rotate-12 shadow-lg"
          />

          {/* Top Right - explore2.png */}
          <img
            src="/explore2.png"
            alt="Kuwait Towers"
            className="absolute -top-8 right-4 w-36 h-28 sm:w-44 sm:h-32 lg:w-52 lg:h-36 rounded-2xl object-cover opacity-90 transform -rotate-12 shadow-lg"
          />

          {/* Bottom Left - explore3.png */}
          <img
            src="/explore3.png"
            alt="Traditional Kuwait"
            className="absolute -bottom-8 left-4 w-38 h-30 sm:w-46 sm:h-34 lg:w-54 lg:h-38 rounded-2xl object-cover opacity-90 transform -rotate-8 shadow-lg"
          />

          {/* Bottom Right - explore4.png */}
          <img
            src="/explore4.png"
            alt="Kuwait Heritage"
            className="absolute -bottom-8 right-2 w-42 h-34 sm:w-50 sm:h-38 lg:w-58 lg:h-42 rounded-2xl object-cover opacity-90 transform rotate-8 shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center py-16 px-6 sm:py-20 sm:px-8">
          {/* Explore Kuwait Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">{t("explore.hero.badge")}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {t("explore.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-pretty">
            {t("explore.hero.subtitle")}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-grey-3 z-10" />
            <TextField
              type="text"
              placeholder={t("explore.hero.searchPlaceholder")}
              className="w-full pl-14 pr-16 py-4 text-normal-regular bg-white rounded-full border-0 shadow-lg focus:ring-2 focus:ring-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-grey-5 hover:bg-grey-4 transition-colors">
              <MapPin className="w-4 h-4 text-grey-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}