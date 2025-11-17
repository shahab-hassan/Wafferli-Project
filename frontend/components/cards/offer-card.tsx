"use client";
import { Calendar, Star, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import Link from "next/link";
import WishlistButton from "../common/wishlist-button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const getBadgeStyles = (badge: NonNullable<OfferCardProps["badge"]>) => {
  switch (badge) {
    case "sponsored":
      return "bg-tertiary text-black";
    case "new_arrival":
      return "bg-green-100 text-green-700";
    case "expiring_soon":
      return "bg-red-100 text-red-600";
    default:
      return "bg-grey-200 text-grey-700";
  }
};

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  offerDetail?: string;
  city: string;
  neighbourhood: string;
  rating: number;
  reviewsCount: number;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  expiryDate: string;
  category: string;
  badge?: "new_arrival" | "sponsored" | "trending" | "expiring_soon" | null;
  flashDeal?: boolean;
  adType?: string;
  className?: string;
  isFavorited: boolean;
  isClaimed?: boolean;
  isResponsive?: boolean;
  onClaim?: () => void;
}

export function OfferCard({
  id,
  title,
  description,
  images,
  city,
  neighbourhood,
  category,
  rating,
  reviewsCount,
  originalPrice,
  discountedPrice,
  offerDetail,
  discountPercentage = 0,
  expiryDate,
  badge,
  flashDeal = false,
  className,
  isFavorited,
  isClaimed = false,
  isResponsive = false,
  onClaim,
}: OfferCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleClaimDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("You must be logged in to claim deals");
      return;
    }
    if (onClaim) {
      onClaim();
    }
  };

  // Timer countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    setIsExpired(new Date(expiryDate).getTime() <= new Date().getTime());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if expired on each interval
      if (new Date(expiryDate).getTime() <= new Date().getTime()) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  const expiry = new Date(expiryDate);

  // Calculate discount percentage if not provided
  const calculatedDiscount =
    discountPercentage ||
    (originalPrice && discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0);

  // Use first image or placeholder
  const imageUrl =
    images?.[0] ||
    "/placeholder.svg?height=145&width=320&query=restaurant food";

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on wishlist button or claim button
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    router.push(`/offers/${id}`);
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col",
        isResponsive ? "w-full" : "w-[320px]",
        "min-h-[450px] max-h-[480px]" // Flexible height with limits
      )}
      onClick={handleCardClick}
    >
      {/* Image Section - Fixed Height */}
      <div className="relative h-[180px] overflow-hidden bg-grey-5 flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Flash Deal Timer */}
        {flashDeal && !isExpired && (
          <div className="absolute bottom-3 left-3 bg-warning text-black-2 px-2 py-1 rounded-[100px] flex items-center gap-1 h-[25px]">
            <Clock className="w-3 h-3" />
            <span className="text-smaller-semibold">
              {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
              {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {calculatedDiscount > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-[100px] text-smaller-semibold h-[25px] flex items-center">
            {calculatedDiscount}% OFF
          </div>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-[100px] flex items-center gap-1 min-w-[60px]">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="text-smaller-semibold text-black-1">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <WishlistButton adId={id} isFavorited={isFavorited} />
        </div>

        {/* Flash Deal Badge */}
        {flashDeal && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-[100px] text-smaller-semibold">
            Flash Deal
          </div>
        )}

        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg text-red-600 font-semibold text-sm">
              Expired
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Dynamic height */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category and Location Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 rounded-[100px] text-smaller-semibold bg-primary/10 text-primary h-[25px] flex items-center max-w-[120px] truncate">
            {truncateText(category, 15)}
          </span>
          <div className="flex items-center gap-1 text-grey-2 flex-shrink-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-smaller-regular truncate max-w-[80px]">
              {truncateText(city, 12)}
            </span>
          </div>
        </div>

        {/* Title & Description - Dynamic height based on content */}
        <div className="space-y-2 mb-3">
          {/* Title - Flexible height */}
          <h3 className="text-normal-semibold text-black-1 line-clamp-2 leading-tight">
            {truncateText(title, 60)}
          </h3>

          {/* Description - Flexible height */}
          <p className="text-small-regular text-grey-2 line-clamp-3 leading-relaxed">
            {truncateText(description, 100)}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="flex items-center gap-2 mb-3">
          {discountedPrice ? (
            <>
              <span className="text-medium-semibold text-primary">
                KD {discountedPrice}
              </span>
              {originalPrice && originalPrice > discountedPrice && (
                <span className="text-smaller-regular text-grey-3 line-through">
                  KD {originalPrice}
                </span>
              )}
            </>
          ) : originalPrice ? (
            <span className="text-medium-semibold text-primary">
              KD {originalPrice}
            </span>
          ) : (
            <span className="text-small-regular text-grey-2">
              Price on request
            </span>
          )}
        </div>

        {/* Expiry Date Row */}
        <div className="flex items-center gap-2 text-grey-2 text-small-regular mb-3">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {isExpired ? "Expired" : "Expires"}:{" "}
            {expiry.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Claim Button - Always at bottom */}
        <div className="mt-auto">
          <Button
            variant={flashDeal ? "tertiary" : "primary"}
            size="lg"
            onClick={handleClaimDeal}
            disabled={isExpired || isClaimed}
            className={cn(
              "w-full text-normal-regular",
              (isExpired || isClaimed) && "opacity-50 cursor-not-allowed",
              flashDeal
                ? "!bg-warning !text-black-2 hover:!bg-warning/90"
                : "!text-white"
            )}
          >
            {isExpired
              ? "Offer Expired"
              : isClaimed
              ? "Already Claimed"
              : flashDeal
              ? "Claim Deal Now"
              : "View Offer Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
