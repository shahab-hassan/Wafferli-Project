"use client"

import type React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Heart, Clock, Star, Gift, Smartphone, Download } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const locale = useLocale()
  const t = useTranslations()
  const isRTL = locale === "ar"

  return (
    <>
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-primary to-secondary text-white py-6 sm:py-8 px-4"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          overflowX: "hidden",
        }}
      >
        <div className="max-w-[1120px] mx-auto text-center">
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 rounded-full text-small-semibold mb-4 sm:mb-6 hover:bg-white/30 transition-colors">
            👥 {t("Auth.hero.joinCommunity")}
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-h2 lg:text-h1 font-bold mb-3 leading-tight">
            {t("Auth.hero.title")}
            <br />
            <span className="text-tertiary">{t("Auth.hero.titleHighlight")}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-large-regular mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
            {t("Auth.hero.subtitle")}
          </p>

          <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-h3 font-bold">10,000+</div>
              <div className="text-xs sm:text-small-regular opacity-80">{t("Auth.hero.stats.happyMembers")}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-h3 font-bold">25K+</div>
              <div className="text-xs sm:text-small-regular opacity-80">{t("Auth.hero.stats.dealsClaimed")}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-h3 font-bold">2.5M KD</div>
              <div className="text-xs sm:text-small-regular opacity-80">{t("Auth.hero.stats.totalSavings")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1120px] w-full pt-6 sm:pt-8 mb-4 px-3 sm:px-4 mx-auto">
        <div
          className={`flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-start ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* What You'll Get section */}
          <div className="flex-1 space-y-4 sm:space-y-6 mx-auto lg:mx-0 max-w-2xl lg:max-w-none">
            <div className="mb-4 sm:mb-6 text-center lg:text-left">
              <h1 className="text-lg sm:text-xl md:text-h5 lg:text-h4 mb-4">{t("Auth.features.title")}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center lg:justify-items-stretch">
              {/* Save Your Favorites */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs sm:max-w-none">
                <div className="h-1 bg-pink-200"></div>
                <div className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Heart className="text-pink-500" size={18} />
                  </div>
                  <h3 className="text-sm sm:text-normal-bold mb-1 sm:mb-2">
                    {t("Auth.features.saveYourFavorites.title")}
                  </h3>
                  <p className="text-xs sm:text-small-regular text-grey-2">
                    {t("Auth.features.saveYourFavorites.description")}
                  </p>
                </div>
              </div>

              {/* Claim History */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs sm:max-w-none">
                <div className="h-1 bg-yellow-200"></div>
                <div className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Clock className="text-yellow-500" size={18} />
                  </div>
                  <h3 className="text-sm sm:text-normal-bold mb-1 sm:mb-2">{t("Auth.features.claimHistory.title")}</h3>
                  <p className="text-xs sm:text-small-regular text-grey-2">
                    {t("Auth.features.claimHistory.description")}
                  </p>
                </div>
              </div>

              {/* Personalized Deals */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs sm:max-w-none">
                <div className="h-1 bg-purple-200"></div>
                <div className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Star className="text-purple-500" size={18} />
                  </div>
                  <h3 className="text-sm sm:text-normal-bold mb-1 sm:mb-2">
                    {t("Auth.features.personalizedDeals.title")}
                  </h3>
                  <p className="text-xs sm:text-small-regular text-grey-2">
                    {t("Auth.features.personalizedDeals.description")}
                  </p>
                </div>
              </div>

              {/* Loyalty Rewards */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs sm:max-w-none">
                <div className="h-1 bg-green-200"></div>
                <div className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Gift className="text-green-500" size={18} />
                  </div>
                  <h3 className="text-sm sm:text-normal-bold mb-1 sm:mb-2">
                    {t("Auth.features.loyaltyRewards.title")}
                  </h3>
                  <p className="text-xs sm:text-small-regular text-grey-2">
                    {t("Auth.features.loyaltyRewards.description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mx-auto max-w-md lg:max-w-none">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#762c85" }}
                >
                  <Smartphone className="text-white" size={20} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm sm:text-normal-bold mb-1 sm:mb-2 text-black">
                    {t("Auth.features.fullExperience.title")}
                  </h3>
                  <p className="text-xs sm:text-small-regular text-grey-2 mb-2 sm:mb-3">
                    {t("Auth.features.fullExperience.description")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      className="text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-small-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#e71e86" }}
                    >
                      <Download size={14} />
                      {t("Auth.features.fullExperience.ios")}
                    </button>
                    <button
                      className="text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-small-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#e71e86" }}
                    >
                      <Download size={14} />
                      {t("Auth.features.fullExperience.android")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="w-full lg:flex-1 lg:max-w-md">{children}</div>
        </div>
      </section>
    </>
  )
}