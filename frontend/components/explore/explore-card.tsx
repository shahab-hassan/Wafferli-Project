"use client";
import { useCallback } from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export interface ExploreCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount?: number;
  distance: string;
  description: string;
  className?: string;
  isResponsive?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function ExploreCard({
  id,
  name,
  category,
  image,
  rating,
  reviewCount,
  distance,
  description,
  className,
  isResponsive = false,
  coordinates,
}: ExploreCardProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleGetDirections = useCallback(() => {
    if (coordinates) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`;
      window.open(mapsUrl, "_blank");
    } else {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
        name
      )}`;
      window.open(mapsUrl, "_blank");
    }
  }, [coordinates, name]);

  const handleMoreInfo = useCallback(() => {
    router.push(`/explore/${id}`);
  }, [id, router]);

  return (
    <div
      className={cn(
        "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        isResponsive ? "w-full h-auto" : "w-[320px] h-[360px]",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-[150px] overflow-hidden bg-grey-5">
        <img
          src={image || "/placeholder.svg?height=150&width=320"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 h-[210px] flex flex-col justify-between">
        {/* Category */}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap w-fit">
          {category}
        </span>

        {/* Title + Description */}
        <div className="space-y-1 pt-2 pb-1">
          <h3 className="text-normal-semibold text-black-1 line-clamp-1">
            {name}
          </h3>
          <p className="text-small-regular text-grey-2 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Rating + Distance */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-small-semibold text-black-1">
              {rating || 0}
            </span>
            {reviewCount !== undefined && (
              <span className="text-small-regular text-grey-2">
                ({reviewCount})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-grey-2">
            <MapPin className="w-3 h-3 text-grey-3" />
            <span className="text-smaller-regular">{distance}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleGetDirections}
            className="flex-1 !text-white text-small-regular"
          >
            <Navigation className="w-3 h-3 mr-1" />
            {t("explore.actions.directions")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoreInfo}
            className="flex-1 text-small-regular bg-transparent"
          >
            {t("explore.actions.moreInfo")}
          </Button>
        </div>
      </div>
    </div>
  );
}
