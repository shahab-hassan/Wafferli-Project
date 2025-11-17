"use client";
import { useEffect, useState } from "react";
import { Clock, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { useWishlist, type WishlistItem } from "@/contexts/wishListContext";
import OfferPopup from "@/components/common/offer-popup/offer-popup";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import WishlistButton from "../common/wishlist-button";

export interface FlashCardProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  city: string;
  neighbourhood: string;
  rating: number;
  reviewsCount: number;
  flashDeal: boolean;
  expiryDate: string;
  discountDeal: boolean;
  fullPrice?: number;
  discountPercent?: number;
  discountedPrice?: number;
  offerDetail?: string;
  isFavorited: boolean;
  className?: string;
  isResponsive?: boolean;
}

export function FlashCard({
  id,
  title,
  description,
  images,
  city,
  neighbourhood,
  rating,
  reviewsCount,
  flashDeal,
  expiryDate,
  discountDeal,
  fullPrice,
  discountedPrice,
  discountPercent,
  offerDetail,
  isFavorited,
  className,
  isResponsive = false,
}: FlashCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

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
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  const handleClaimDeal = () => {
    setShowPopup(true);
    toast.success("Flash deal claimed successfully!");
  };

  // Don't render if not a flash deal
  if (!flashDeal) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "group relative bg-white rounded-[16px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
          isResponsive ? "w-full h-auto" : "w-[320px] h-[320px]",
          isExpired && "opacity-70 grayscale",
          className
        )}
      >
        {/* Image Section */}
        <div className="relative h-[145px] overflow-hidden bg-grey-5">
          <img
            src={
              images[0] ||
              "/placeholder.svg?height=145&width=320&query=restaurant food"
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge - Only show if it's a discount deal */}
          {discountDeal && discountPercent && (
            <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-[100px] text-smaller-semibold h-[25px] flex items-center">
              {discountPercent}% OFF
            </div>
          )}

          {/* Timer Badge */}
          <div className="absolute bottom-4 left-4 bg-warning text-black-2 px-2 py-1 rounded-[100px] flex items-center gap-1 h-[25px]">
            <Clock className="w-3 h-3" />
            <span className="text-smaller-semibold">
              {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
              {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 h-32px bg-white/95 backdrop-blur-sm px-2 py-1 rounded-[100px] flex items-center gap-1">
            <Star className="w-5 h-5 fill-warning text-warning" />
            <span className="text-normal-semibold text-black-1">
              {rating || 0}
            </span>
            {reviewsCount > 0 && (
              <span className="text-xs text-grey-2">({reviewsCount})</span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <WishlistButton adId={id} isFavorited={isFavorited} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 h-[175px] flex flex-col justify-between">
          {/* Location Row */}
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 rounded-[100px] text-smaller-semibold bg-primary/10 text-primary h-[25px] flex items-center">
              {city}
            </span>
            <div className="flex items-center gap-1 text-grey-2">
              <MapPin className="w-3 h-3" />
              <span className="text-smaller-regular">{neighbourhood}</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1 pt-2 pb-1">
            <h3 className="text-normal-semibold text-black-1 line-clamp-1 leading-tight">
              {title}
            </h3>
            <p className="text-small-regular text-grey-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2">
            {discountDeal ? (
              <>
                <span className="text-medium-semibold  text-primary">
                  {discountedPrice}
                </span>
                <span className="text-smaller-regular text-grey-3 line-through">
                  {fullPrice}
                </span>
              </>
            ) : (
              <span className="text-medium-semibold  text-primary">
                {offerDetail}
              </span>
            )}
          </div>

          {/* Claim Deal Button */}
          <Button
            variant="tertiary"
            size="lg"
            onClick={handleClaimDeal}
            disabled={isExpired}
            className={cn(
              "w-full text-normal-semibold mt-1 mb-4",
              isExpired && "opacity-50 cursor-not-allowed"
            )}
          >
            {isExpired ? "Deal Expired" : "Claim Flash Deal"}
          </Button>
        </div>
      </div>

      {/* Render popup via portal */}
      {/* {showPopup &&
        createPortal(
          <OfferPopup
            open={showPopup}
            onClose={() => setShowPopup(false)}
            offerData={{
              id,
              title,
              description,
              image: images[0],
              location: `${neighbourhood}, ${city}`,
              rating,
              originalPrice: prices.originalPrice,
              discountedPrice: prices.discountedPrice,
              discountPercentage: prices.discountPercentage,
              expiryDate,
            }}
          />,
          document.body
        )} */}
    </>
  );
}
