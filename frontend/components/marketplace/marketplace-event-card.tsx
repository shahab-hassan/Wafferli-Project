"use client";
import { Calendar, Clock, MapPin, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import Link from "next/link";
import { Badge } from "@/components/common/badge";
import { useTranslations } from "next-intl";
import WishlistButton from "../common/wishlist-button";

export interface MarketplaceEventCardProps {
  data: {
    id: string;
    name: string;
    image: string;
    rating: number;
    isFavorited: boolean;
    reviewCount?: number;
    description: string;
    location?: string;
    eventDate?: string;
    startTime?: string;
    eventType?: string;
    featuresAmenities?: string[];
    isUpcoming?: boolean;
  };
  className?: string;
}

export function MarketplaceEventCard({
  data,
  className,
}: MarketplaceEventCardProps) {
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
    eventDate,
    startTime,
    eventType,
    featuresAmenities = [],
    isUpcoming,
  } = data;

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventTypeDisplay = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      concert: "Concert",
      sports: "Sports",
      exhibition: "Exhibition",
      festival: "Festival",
      conference: "Conference",
      workshop: "Workshop",
      party: "Party",
      other: "Event",
    };
    return typeMap[type || "other"] || type;
  };
  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Chat with seller:");
  };
  return (
    <div
      className={cn(
        "group relative bg-white rounded-[14px] overflow-visible border border-grey-5 transition-all duration-200 hover:shadow-md",
        "w-full max-w-[340px]",
        className
      )}
    >
      <Link href={`/event/${id}`}>
        {/* IMAGE AREA */}
        <div className="relative h-[160px] bg-gray-100 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <WishlistButton adId={id} isFavorited={isFavorited} />{" "}
          </div>
          {/* Event Type Badge */}
          {/* {eventType && (
          <div className="absolute top-3 left-3 rounded-full px-2 py-1 text-xs font-semibold bg-purple-500 text-white shadow-sm">
            {getEventTypeDisplay(eventType)}
          </div>
        )} */}

          {/* Status Badge */}
          {isUpcoming !== undefined && (
            <div
              className={`absolute top-3 left-3 rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${
                isUpcoming
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {isUpcoming ? "Upcoming" : "Past"}
            </div>
          )}

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

          <Badge className="bg-purple-100 text-purple-700 backdrop-blur-sm mb-4">
            {getEventTypeDisplay(eventType)}
          </Badge>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-2">
            {name}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(eventDate)}</span>
            {startTime && (
              <>
                <Clock className="w-3 h-3 ml-1" />
                <span>{startTime}</span>
              </>
            )}
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Chat  Button */}
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
    </div>
  );
}
