"use client";
import {
  Clock,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import Link from "next/link";
import { Badge } from "@/components/common/badge";
import { useTranslations } from "next-intl";
import WishlistButton from "../common/wishlist-button";

export interface MarketplaceExploreCardProps {
  data: {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount?: number;
    description: string;
    location?: string;
    isFavorited: boolean;
    exploreName?: string;
    exploreDescription?: string;
    startTime?: string;
    endTime?: string;
    featuresAmenities?: string[];
  };
  className?: string;
}

export function MarketplaceExploreCard({
  data,
  className,
}: MarketplaceExploreCardProps) {
  const t = useTranslations();

  const {
    id,
    name,
    image,
    rating,
    reviewCount,
    description,
    location,
    isFavorited,
    exploreName,
    exploreDescription,
    startTime,
    endTime,
    featuresAmenities = [],
  } = data;

  const displayName = exploreName || name;
  const displayDescription = exploreDescription || description;

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Chat with seller:", seller);
  };
  return (
    <Link
      href={`/explore/${id}`}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-gray-300",
        "w-full max-w-[300px]",
        className
      )}
    >
      {/* IMAGE AREA */}
      <div className="relative h-[160px] bg-gray-100 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2 right-2">
          <WishlistButton adId={id} isFavorited={isFavorited} />{" "}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-2">
          {displayName}
        </h3>

        {/* Hours */}
        {(startTime || endTime) && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <Clock className="w-3 h-3" />
            <span>
              {startTime || "N/A"} - {endTime || "N/A"}
            </span>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {displayDescription}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleChat}
          className="w-full rounded-full py-3 text-sm bg-transparent border-grey-4 text-grey-1 hover:bg-grey-6 hover:border-grey-3"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t("marketplace.actions.chat")}
        </Button>
      </div>
    </Link>
  );
}
