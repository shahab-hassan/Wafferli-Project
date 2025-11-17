// components/offer-detail/OfferDetails.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Minus,
  AlertTriangle,
  Phone,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { Badge } from "@/components/common/badge";
import OfferPopup from "@/components/common/offer-popup/offer-popup";

interface OfferDetailsProps {
  offer: {
    _id: string;
    images: string[];
    title: string;
    description: string;
    city: string;
    neighbourhood: string;
    phone: string;
    showPhone: boolean;
    rating: number;
    reviewsCount: number;
    favoritesCount: number;
    adType: string;
    flashDeal: boolean;
    expiryDate: string;
    discountDeal: boolean;
    offerDetail: string;
    createdAt: string;
    discountedPrice: number | null;
    isFavorited: boolean;
    discountPercentage?: number;
    fullPrice?: number;
    claimDeal: boolean;
    isClaimed?: boolean;
  };
}

export default function OfferDetails({ offer }: OfferDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer calculation based on expiryDate
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = new Date(offer.expiryDate);
      const now = new Date();
      const difference = expiry.getTime() - now.getTime();

      if (difference > 0) {
        setIsExpired(false);
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      setIsExpired(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [offer.expiryDate]);

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(quantity + 1);
    } else {
      setQuantity(Math.max(1, quantity - 1));
    }
  };

  // Calculate pricing based on discount deal
  const calculatePricing = () => {
    const fullPrice = offer.fullPrice || 0;
    let discountedPrice = offer.discountedPrice;
    let discountPercentage = offer.discountPercentage || 0;
    let savings = 0;

    // If discount deal is active but discountedPrice is not provided, calculate it
    if (
      offer.discountDeal &&
      fullPrice > 0 &&
      discountPercentage > 0 &&
      !discountedPrice
    ) {
      discountedPrice = Math.round(
        fullPrice - (fullPrice * discountPercentage) / 100
      );
    }

    // If discountedPrice is provided but discountPercentage is not, calculate it
    if (discountedPrice && fullPrice > 0 && discountPercentage === 0) {
      discountPercentage = Math.round(
        ((fullPrice - discountedPrice) / fullPrice) * 100
      );
    }

    // Calculate savings
    if (discountedPrice && fullPrice > 0) {
      savings = fullPrice - discountedPrice;
    }

    return {
      fullPrice,
      discountedPrice: discountedPrice || fullPrice,
      discountPercentage,
      savings,
      hasDiscount: discountPercentage > 0 && savings > 0,
    };
  };

  const {
    fullPrice,
    discountedPrice,
    discountPercentage,
    savings,
    hasDiscount,
  } = calculatePricing();

  // Format date
  const formattedExpiryDate = new Date(offer.expiryDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate remaining deals (using favoritesCount as proxy)
  const remaining = Math.max(0, 50 - (offer.favoritesCount || 0));

  // Calculate total price
  const totalPrice = (discountedPrice || 0) * quantity;

  // Check if offer is claimed or expired
  const isOfferClaimed = offer.isClaimed || offer.claimDeal;
  const isOfferExpired =
    isExpired ||
    (timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0);

  const getButtonText = () => {
    if (isOfferClaimed) {
      return "Offer Claimed";
    }
    if (isOfferExpired) {
      return "Offer Expired";
    }
    return "Claim This Offer";
  };

  const isButtonDisabled = isOfferClaimed || isOfferExpired;

  return (
    <>
      <Card className="bg-transparent !rounded-md">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 lg:space-y-6">
            {/* Offer Summary */}
            <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
                <Badge className="bg-red-100 text-red-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {offer.flashDeal ? "Flash Deal" : "Offer"}
                </Badge>
                {offer.discountDeal && hasDiscount && (
                  <Badge className="bg-green-100 text-green-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {isOfferClaimed && (
                  <Badge className="bg-blue-100 text-blue-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    Claimed
                  </Badge>
                )}
                <Badge className="bg-gray-100 text-gray-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {offer.city}
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                {offer.title || "N/A"}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 lg:mb-6 text-sm sm:text-base">
                {offer.description || "N/A"}
              </p>

              {/* Location and Rating */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {offer.neighbourhood || "N/A"}, {offer.city || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {offer.rating || 0} ({offer.reviewsCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <span className="text-2xl lg:text-3xl font-bold text-purple-600">
                        {discountedPrice} KD
                      </span>
                      {hasDiscount && fullPrice > discountedPrice && (
                        <span className="text-lg lg:text-xl text-gray-400 line-through">
                          {fullPrice} KD
                        </span>
                      )}
                    </div>
                    {hasDiscount && savings > 0 && (
                      <div className="text-green-600 font-semibold text-sm lg:text-base">
                        You save {savings} KD ({discountPercentage}% off)
                      </div>
                    )}
                    {!hasDiscount && fullPrice > 0 && (
                      <div className="text-gray-600 text-sm lg:text-base">
                        Regular Price
                      </div>
                    )}
                  </div>
                  {hasDiscount && discountPercentage > 0 && (
                    <div className="text-right">
                      <div className="text-xl lg:text-2xl font-bold text-green-600">
                        {discountPercentage}%
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600">
                        Discount
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Offer Details */}
            {offer.offerDetail && (
              <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
                <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                  Offer Details
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {offer.offerDetail}
                </p>
              </div>
            )}

            {/* Validity Information */}
            <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                Validity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">
                      Valid Until
                    </div>
                    <div className="text-gray-600 text-sm">
                      {formattedExpiryDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">
                      Created
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              {!isOfferExpired ? (
                <div className="mt-4 p-3 lg:p-4 bg-purple-200 rounded-xl lg:rounded-xl">
                  <div className="text-center">
                    <div className="text-xs lg:text-sm text-gray-600 mb-2">
                      Offer expires in:
                    </div>
                    <div className="flex justify-center space-x-2 sm:space-x-4">
                      {[
                        { value: timeLeft.days, label: "Days" },
                        { value: timeLeft.hours, label: "Hours" },
                        { value: timeLeft.minutes, label: "Minutes" },
                        { value: timeLeft.seconds, label: "Seconds" },
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl text-white bg-purple-700/80 h-12 w-12 rounded-full text-center justify-center flex items-center mx-auto mb-1">
                            {item.value.toString().padStart(2, "0")}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 lg:p-4 bg-red-200 rounded-xl lg:rounded-xl">
                  <div className="text-center text-red-700 font-semibold">
                    This offer has expired
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {offer.showPhone && offer.phone && (
              <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
                <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                  Contact Information
                </h3>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">{offer.phone}</span>
                </div>
              </div>
            )}

            {/* Primary CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl lg:rounded-3xl p-4 lg:p-6 text-white">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div>
                  <div className="text-base lg:text-lg font-semibold">
                    {isOfferClaimed
                      ? "Offer Already Claimed"
                      : "Ready to claim this deal?"}
                  </div>
                  <div className="text-white/80 text-sm">
                    {offer.favoritesCount > 0
                      ? `Liked by ${offer.favoritesCount} people`
                      : "Be the first to claim!"}
                  </div>
                </div>
                {remaining <= 20 && remaining > 0 && !isOfferExpired && (
                  <Badge className="bg-red-500 text-white rounded-full px-2 lg:px-3 py-1 animate-pulse text-xs">
                    <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    Only {remaining} left!
                  </Badge>
                )}
              </div>

              <div className="mb-4">
                <div className="text-xl lg:text-2xl font-bold">
                  {totalPrice.toFixed(1)} KD
                </div>
                <div className="text-white/80 text-xs lg:text-sm">Total</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  onClick={() => setShowClaimPopup(true)}
                  disabled={isButtonDisabled}
                  className={`flex-1 rounded-xl lg:rounded-2xl py-3 lg:py-4 text-sm lg:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                    isOfferClaimed
                      ? "bg-gray-400 text-white hover:bg-gray-500"
                      : isOfferExpired
                      ? "bg-gray-400 text-white hover:bg-gray-500"
                      : "bg-yellow-400 text-black hover:bg-yellow-500"
                  }`}
                >
                  {getButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showClaimPopup && !isButtonDisabled && (
        <OfferPopup
          offer={offer}
          open={showClaimPopup}
          onOpenChange={setShowClaimPopup}
        />
      )}
    </>
  );
}
