"use client";

import { useTranslations, useLocale } from "next-intl";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { GetFavorites } from "@/features/slicer/AdSlice";
import { useEffect, useState } from "react";
import AdCard from "@/components/common/ad-card";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const locale = useLocale();
  const [favorites, setFavorites] = useState<any>([]);

  const dispatch = useDispatch();

  const getFavorites = async () => {
    const res = await dispatch(GetFavorites() as any).unwrap();
    console.log(res, "res");
    if (res.success) {
      setFavorites(res.data.favorites); // ✅ Yahan change kiya - res.data.favorites
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  // Group favorites by adType
  const grouped = favorites.reduce((acc: any, item: any) => {
    if (!acc[item.adType]) {
      acc[item.adType] = [];
    }
    acc[item.adType].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  console.log("Grouped favorites:", grouped);

  return (
    <div
      className={clsx(
        "container mx-auto p-4 mt-2 max-w-[1440px] w-full",
        locale === "ar" ? "text-right" : "text-left"
      )}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      {favorites.length === 0 ? (
        <p>{t("empty")}</p>
      ) : (
        Object.keys(grouped).map((type) => (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t(`sections.${type}`, { default: type })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {grouped[type].map((item: any, index: number) => (
                <AdCard
                  key={item._id || index}
                  id={item._id}
                  type={item.adType}
                  title={item.title}
                  subtitle={item.description}
                  image={item.images?.[0] || "/placeholder.svg"}
                  category={item.category || item.eventType || item.serviceType}
                  rating={item.rating}
                  reviewCount={item.reviewsCount}
                  // Product specific
                  askingPrice={item.askingPrice}
                  price={
                    item.askingPrice ? `${item.askingPrice}` : item.servicePrice
                  }
                  // Offer specific
                  discountPercent={item.discountPercent}
                  // Event specific
                  eventDate={item.eventDate}
                  eventTime={item.eventTime}
                  // Service specific
                  serviceType={item.serviceType}
                  // Explore specific
                  location={item.city}
                  // Favorite props
                  isFavorited={item.isFavorited}
                  favoritesCount={item.favoritesCount}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
