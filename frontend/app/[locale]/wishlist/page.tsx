"use client"

import { useWishlist, WishlistItem } from "@/contexts/wishListContext"
import { FlashCard } from "@/components/cards/flash-card"
import { OfferCard } from "@/components/cards/offer-card"
import { ProductCard } from "@/components/cards/product-card"
import { ExploreCard } from "@/components/explore/explore-card"
import { EventCard } from "@/components/event-page/event-card"

import { MarketplaceProductCard } from "@/components/marketplace/marketplace-product-card"
import { MarketplaceServiceCard } from "@/components/marketplace/marketplace-service-card"

import { useTranslations, useLocale } from "next-intl"
import clsx from "clsx"

export default function WishlistPage() {
  const { wishlist } = useWishlist()
  const t = useTranslations("wishlist") // namespace: wishlist
  const locale = useLocale()

  const grouped = wishlist.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

  return (
    <div
      className={clsx(
        "container mx-auto p-4 mt-2 max-w-[1440px] w-full",
        locale === "ar" ? "text-right" : "text-left"
      )}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      {Object.keys(grouped).length === 0 ? (
        <p>{t("empty")}</p>
      ) : (
        Object.keys(grouped).map((type) => (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t(`sections.${type}`, { default: type })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {grouped[type].map((item, index) => {
                switch (item.type) {
                  case "flash":
                    return <FlashCard key={index} {...item.props} />
                  case "offer":
                    return <OfferCard key={index} {...item.props} />
                  case "product":
                    return <ProductCard key={index} {...item.props} />
                  case "event":
                    return <EventCard key={index} {...item.props} />
                  case "explore":
                    return <ExploreCard key={index} {...item.props} />
                  case "marketplace-product":
                    return <MarketplaceProductCard key={index} {...item.props} />
                  case "marketplace-service":
                    return <MarketplaceServiceCard key={index} {...item.props} />
                  default:
                    return null
                }
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
