"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { CheckCircle, MapPin, Calendar, Tag, ShoppingBag, Wrench } from "lucide-react"

interface AdTypesSectionProps {
  locale: string
}

const adTypeIcons = [MapPin, Calendar, Tag, ShoppingBag, Wrench]
const adTypeColors = [
  "from-purple-600 to-purple-800",
  "from-pink-600 to-pink-800",
  "from-green-600 to-green-800",
  "from-blue-600 to-blue-800",
  "from-yellow-600 to-yellow-800",
]

export function AdTypesSection({ locale }: AdTypesSectionProps) {
  const t = useTranslations("ForBusinesses")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Safe feature extraction with fallback
  const getFeatures = (key: string): string[] => {
    try {
      const features = t.raw(key)
      if (Array.isArray(features)) {
        return features
      }
      // If it's a string, split by newlines or commas
      if (typeof features === 'string') {
        return features.split(/[\n,]/).map(f => f.trim()).filter(f => f.length > 0)
      }
      return []
    } catch (error) {
      console.warn(`Missing translation for ${key}`)
      return []
    }
  }

  const adTypes = [
    {
      title: t("adTypes.explore.title") || "Local Explore Ads",
      description: t("adTypes.explore.description") || "Promote your business to local customers",
      price: t("adTypes.explore.price") || "$5/day",
      features: getFeatures("adTypes.explore.features"),
    },
    {
      title: t("adTypes.events.title") || "Event Promotions",
      description: t("adTypes.events.description") || "Boost your events and activities",
      price: t("adTypes.events.price") || "$10/day",
      features: getFeatures("adTypes.events.features"),
    },
    {
      title: t("adTypes.offers.title") || "Special Offers",
      description: t("adTypes.offers.description") || "Highlight discounts and deals",
      price: t("adTypes.offers.price") || "$7/day",
      features: getFeatures("adTypes.offers.features"),
    },
    {
      title: t("adTypes.products.title") || "Product Showcase",
      description: t("adTypes.products.description") || "Feature your best products",
      price: t("adTypes.products.price") || "$8/day",
      features: getFeatures("adTypes.products.features"),
    },
    {
      title: t("adTypes.services.title") || "Service Listings",
      description: t("adTypes.services.description") || "Promote your professional services",
      price: t("adTypes.services.price") || "$6/day",
      features: getFeatures("adTypes.services.features"),
    },
  ]

  const boostingOptions = [
    {
      title: t("boosting.standard.title") || "Standard Boost",
      price: t("boosting.standard.price") || "$15/week",
      description: t("boosting.standard.description") || "Basic visibility boost",
      features: getFeatures("boosting.standard.features"),
      popular: false,
    },
    {
      title: t("boosting.featured.title") || "Featured Boost",
      price: t("boosting.featured.price") || "$35/week",
      description: t("boosting.featured.description") || "Enhanced visibility and features",
      features: getFeatures("boosting.featured.features"),
      popular: true,
    },
    {
      title: t("boosting.sponsored.title") || "Sponsored Ads",
      price: t("boosting.sponsored.price") || "$60/week",
      description: t("boosting.sponsored.description") || "Premium placement and targeting",
      features: getFeatures("boosting.sponsored.features"),
      popular: false,
    },
  ]

  return (
    <section className="flex justify-center items-center mt-4">
      <div className="container max-w-[1220px] w-full mx-auto px-4">
        {/* Ad Types */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("adTypes.title") || "Choose Your Ad Type"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("adTypes.subtitle") || "Select the perfect advertising solution for your business"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
          {adTypes.map((adType, index) => {
            const IconComponent = adTypeIcons[index]
            return (
              <Card
                key={index}
                className="rounded-xl border hover:shadow-md transition-all duration-300 transform hover:scale-103 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${adTypeColors[index]}`}></div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{adType.title}</h3>
                    <p className="text-gray-600 mb-4">{adType.description}</p>
                    <div className="text-3xl font-bold text-purple-600 mb-4">{adType.price}</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {adType.features.length > 0 ? (
                      adType.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))
                    ) : (
                      // Fallback features if none are available
                      ['Targeted local reach', 'Easy setup', '24/7 support'].map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))
                    )}
                  </ul>

                  <Button
                    className={`w-full rounded-full bg-gradient-to-r ${adTypeColors[index]} text-white hover:opacity-90`}
                  >
                    {t("adTypes.cta") || "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Boosting Options */}
        <div className="p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("boosting.title") || "Boost Your Visibility"}
            </h3>
            <p className="text-xl text-gray-600">
              {t("boosting.subtitle") || "Enhance your reach with our boosting options"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boostingOptions.map((option, index) => {
              const isSelected = selectedIndex === index
              return (
                <Card
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative cursor-pointer rounded-xl transition-all duration-300 border-1 ${
                    isSelected
                      ? "ring-4 ring-purple-600 ring-opacity-50 scale-105"
                      : "hover:shadow-xl"
                  }`}
                >
                  {/* Floating Badge */}
                  {(option.popular || isSelected) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full font-semibold text-xs shadow-md">
                      {option.popular && (t("boosting.featured.popular") || "Most Popular")}
                      {isSelected && !option.popular && (t("boosting.selected") || "Selected")}
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h4>
                      <div className="text-2xl font-bold text-purple-600 mb-2">{option.price}</div>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>

                    <ul className="space-y-2">
                      {option.features.length > 0 ? (
                        option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))
                      ) : (
                        // Fallback features
                        ['Enhanced visibility', 'Priority placement', 'Analytics dashboard'].map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}