"use client"

import { MapPin, Search } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

export function HeroSection() {
  const [query, setQuery] = useState("")
  const t = useTranslations("Eventpage.hero")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section aria-labelledby="hero-title" className="relative w-full -mt-4 mb-4">
      {/* Gradient background with rounded corners */}
      <div
        className="relative w-full"
        style={{
          background: "linear-gradient(135deg, #762c85 0%, #e71e86 100%)",
        }}
      >
        {/* Content */}
        <div className="relative z-10 px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-16 lg:py-20">
          {/* Badge */}
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/10 px-4 py-1.5 text-white/95 backdrop-blur-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">{t("badge")}</span>
          </div>

          {/* Heading */}
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
          >
            {t.rich("title", {
              highlight: (chunks) => <span className="text-[#fecd07]">{chunks}</span>,
            })}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/90 sm:text-lg">
            {t("subtitle")}
          </p>

          {/* Search */}
          <form role="search" className="mx-auto mt-6 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="hero-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <div className="relative">
              {/* Icon flips position in RTL */}
              <Search
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-black/50 ${
                  isRTL ? "right-4" : "left-4"
                }`}
                aria-hidden="true"
              />
              <input
                id="hero-search"
                name="q"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className={`w-full rounded-full border-0 bg-white/95 ${
                  isRTL ? "pr-11 pl-14" : "pl-11 pr-14"
                } py-3 text-sm sm:text-base text-black placeholder:text-black/50 shadow-lg outline-none focus:ring-2 focus:ring-white/60`}
              />
              <button
                type="button"
                className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white/60 ${
                  isRTL ? "left-1.5" : "right-1.5"
                }`}
                aria-label={t("useLocation")}
                title={t("useLocation")}
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>

        {/* Decorative trees */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[120px] sm:h-[140px] md:h-[160px]">
          {/* Left trees */}
          <img
            src="/trees-event-page.png"
            alt={t("treesAlt")}
            className="absolute bottom-0 left-[-28px] w-auto sm:left-[-36px] h-[160px] md:left-[-48px] md:h-[260px]"
          />
          {/* Right trees */}
          <img
            src="/trees-event-page.png"
            alt={t("treesAlt")}
            className="absolute bottom-0 right-[-28px] w-auto -scale-x-100 sm:right-[-36px] h-[160px] md:right-[-48px] md:h-[260px]"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
