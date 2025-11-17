"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { GetFeaturedFlashDeal } from "@/features/slicer/AdSlice";
import { SkeletonCard } from "../SkeletonCard";
import { OfferCard } from "@/components/cards/offer-card";
import OfferPopup from "../offer-popup/offer-popup";

export interface FlashDealsSliderProps {
  autoSlideInterval?: number;
  className?: string;
}

export function FlashDealsSlider({
  autoSlideInterval = 5000,
  className,
}: FlashDealsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const dispatch = useDispatch();

  // Global timer for the flash deals section
  const [globalTimeLeft, setGlobalTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [showClaimPopup, setShowClaimPopup] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const fetchFlashDeals = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetFeaturedFlashDeal() as any).unwrap();
      if (res?.data) {
        setFlashDeals(res.data);

        // Calculate global timer based on the earliest expiry date
        if (res.data.length > 0) {
          const earliestExpiry = new Date(
            Math.min(
              ...res.data.map((deal: any) =>
                new Date(deal.expiryDate).getTime()
              )
            )
          );
          updateGlobalTimer(earliestExpiry);
        }
      }
    } catch (error) {
      console.error("Error fetching flash deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalTimer = (expiryDate: Date) => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = expiryDate.getTime() - now;

      if (difference <= 0) {
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

    setGlobalTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setGlobalTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    fetchFlashDeals();
  }, [dispatch]);

  // Check screen size and determine layout
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Determine items per slide based on screen size
  const getItemsPerSlide = () => {
    switch (screenSize) {
      case "mobile":
        return 1;
      case "tablet":
        return 2;
      case "desktop":
        return 3;
      default:
        return 3;
    }
  };

  const itemsPerSlide = getItemsPerSlide();
  const totalSlides = Math.ceil(flashDeals.length / itemsPerSlide);
  const canSlide = totalSlides > 1;

  // Detect RTL from document
  const isRTL =
    typeof document !== "undefined"
      ? document?.documentElement?.dir === "rtl"
      : false;

  // Auto slide functionality
  useEffect(() => {
    if (!canSlide || isPaused || flashDeals.length === 0) return;

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoSlideInterval);

    return () => clearInterval(slideTimer);
  }, [canSlide, isPaused, autoSlideInterval, totalSlides, flashDeals.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const formatTime = (time: number) => time.toString().padStart(2, "0");
  const t = useTranslations("FlashDeals");

  // Function to handle successful claim
  const handleClaimSuccess = (claimedOfferId: string) => {
    // Update the local state to mark the offer as claimed
    setFlashDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal._id === claimedOfferId
          ? { ...deal, isClaimed: true, claimDeal: true }
          : deal
      )
    );
  };

  const handleClaimOffer = (offer: any) => {
    console.log("Claiming offer:", offer);
    setSelectedOffer(offer);
    setShowClaimPopup(true);
  };

  return (
    <div className={cn("w-full relative overflow-hidden", className)}>
      {/* Background Container */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full max-w-[1440px] mx-auto">
          {/* Left Yellow Blob */}
          <div className="absolute left-0 top-0 w-[40%] sm:w-[50%] md:w-[46%] max-w-[665px] h-[35%] sm:h-[40%] max-h-[282px]">
            <svg
              viewBox="0 0 665 282"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 282C0 244.967 8.60156 208.297 25.3143 174.083C42.0272 139.87 66.5237 108.782 97.405 82.5957C128.286 56.4096 164.948 35.6382 205.296 21.4664C245.606 7.30811 288.807 0.01474 332.438 0.000823975L665 0C665 37.0327 656.398 73.7029 639.686 107.917C622.973 142.131 598.476 173.218 567.595 199.404C536.714 225.59 500.052 246.362 459.704 260.534C419.394 274.692 376.193 281.986 332.563 282H0Z"
                fill="#FECD07"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Right Yellow Blob */}
          <div className="absolute right-0 bottom-0 w-[40%] sm:w-[50%] md:w-[46%] max-w-[665px] h-[35%] sm:h-[40%] max-h-[282px] rotate-180">
            <svg
              viewBox="0 0 665 282"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 282C0 244.967 8.60156 208.297 25.3143 174.083C42.0272 139.87 66.5237 108.782 97.405 82.5957C128.286 56.4096 164.948 35.6382 205.296 21.4664C245.606 7.30811 288.807 0.01474 332.438 0.000823975L665 0C665 37.0327 656.398 73.7029 639.686 107.917C622.973 142.131 598.476 173.218 567.595 199.404C536.714 225.59 500.052 246.362 459.704 260.534C419.394 274.692 376.193 281.986 332.563 282H0Z"
                fill="#FECD07"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-[24px] shadow-lg overflow-hidden">
          <div className="flex flex-col p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Section */}
            <div className="text-center mb-4 sm:mb-6 flex-shrink-0 w-full">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-warning fill-current" />
                <h2 className="text-2xl sm:text-3xl lg:text-h3 text-warning font-bold">
                  {t("title") || "Flash Deals"}
                </h2>
              </div>

              <p className="text-medium-regular sm:text-large-regular text-grey-1 mb-3 sm:mb-4">
                {t("subtitle") || "Limited time offers - Don't miss out!"}
              </p>

              {/* Global Timer */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                {globalTimeLeft.days > 0 && (
                  <>
                    <div className="flex items-center justify-center bg-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-[100px] text-large-semibold font-bold min-w-[40px] min-h-[40px] sm:min-w-[60px] sm:min-h-[60px]">
                      {formatTime(globalTimeLeft.days)}
                    </div>
                    <span className="text-large-semibold text-primary">:</span>
                  </>
                )}
                <div className="flex items-center justify-center bg-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-[100px] text-large-semibold font-bold min-w-[40px] min-h-[40px] sm:min-w-[60px] sm:min-h-[60px]">
                  {formatTime(globalTimeLeft.hours)}
                </div>
                <span className="text-large-semibold text-primary">:</span>
                <div className="flex items-center justify-center bg-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-[100px] text-large-semibold font-bold min-w-[40px] min-h-[40px] sm:min-w-[60px] sm:min-h-[60px]">
                  {formatTime(globalTimeLeft.minutes)}
                </div>
                <span className="text-large-semibold text-primary">:</span>
                <div className="flex items-center justify-center bg-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-[100px] text-large-semibold font-bold min-w-[40px] min-h-[40px] sm:min-w-[60px] sm:min-h-[60px]">
                  {formatTime(globalTimeLeft.seconds)}
                </div>
              </div>
            </div>

            {/* Deals Slider - YAHAN FIX KARTA HOON */}
            <div className="flex-1 w-full overflow-hidden">
              {screenSize === "mobile" ? (
                // Mobile View - Simple single card slider
                <div className="w-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {loading ? (
                      // Loading state
                      <div className="w-full flex-shrink-0 px-2">
                        <SkeletonCard />
                      </div>
                    ) : (
                      // Actual deals
                      flashDeals.map((deal, index) => (
                        <div
                          key={deal._id || index}
                          className="w-full flex-shrink-0 px-2"
                        >
                          <OfferCard
                            id={deal._id}
                            title={deal.title}
                            description={deal.description}
                            images={deal.images}
                            city={deal.city}
                            neighbourhood={deal.neighbourhood}
                            rating={deal.rating}
                            reviewsCount={deal.reviewsCount}
                            discountedPrice={deal.discountedPrice || null}
                            isFavorited={deal.isFavorited}
                            originalPrice={deal.originalPrice || deal.fullPrice}
                            discountPercentage={
                              deal.discountPercentage || deal.discountPercent
                            }
                            expiryDate={deal.expiryDate}
                            flashDeal={deal.flashDeal}
                            offerDetail={deal.offerDetail}
                            adType={deal.adType}
                            category={deal.category}
                            isClaimed={deal.isClaimed}
                            isResponsive={true}
                            className="w-full mx-auto"
                            onClaim={() => handleClaimOffer(deal)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // Tablet & Desktop View - Grid based slider
                <div className="w-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {Array.from({ length: totalSlides }).map(
                      (_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                          <div
                            className={`grid ${
                              screenSize === "tablet"
                                ? "grid-cols-2 gap-4"
                                : "grid-cols-3 gap-4"
                            } w-full px-4`}
                          >
                            {loading
                              ? // Skeleton loading
                                Array.from({ length: itemsPerSlide }).map(
                                  (_, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-center"
                                    >
                                      <SkeletonCard />
                                    </div>
                                  )
                                )
                              : // Actual deals
                                flashDeals
                                  .slice(
                                    slideIndex * itemsPerSlide,
                                    (slideIndex + 1) * itemsPerSlide
                                  )
                                  .map((deal) => (
                                    <div
                                      key={deal._id}
                                      className="flex justify-center"
                                    >
                                      <OfferCard
                                        id={deal._id}
                                        title={deal.title}
                                        description={deal.description}
                                        images={deal.images}
                                        city={deal.city}
                                        neighbourhood={deal.neighbourhood}
                                        category={deal.category}
                                        rating={deal.rating}
                                        reviewsCount={deal.reviewsCount}
                                        discountedPrice={
                                          deal.discountedPrice || null
                                        }
                                        isFavorited={deal.isFavorited}
                                        originalPrice={
                                          deal.originalPrice || deal.fullPrice
                                        }
                                        discountPercentage={
                                          deal.discountPercentage ||
                                          deal.discountPercent
                                        }
                                        expiryDate={deal.expiryDate}
                                        flashDeal={deal.flashDeal}
                                        offerDetail={deal.offerDetail}
                                        adType={deal.adType}
                                        isClaimed={deal.isClaimed}
                                        className="w-full max-w-[300px]"
                                        onClaim={() => handleClaimOffer(deal)}
                                      />
                                    </div>
                                  ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="flex-shrink-0 pt-4 sm:pt-6 w-full">
              {/* Slide Indicators - Only show if there are multiple slides */}
              {canSlide && !loading && flashDeals.length > 0 && (
                <div className="flex justify-center gap-3 mb-6 sm:mb-8">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-200",
                        index === currentSlide
                          ? "bg-primary w-8"
                          : "bg-grey-4 hover:bg-grey-3"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Claim Popup */}
              {showClaimPopup && selectedOffer && (
                <OfferPopup
                  offer={selectedOffer}
                  open={showClaimPopup}
                  onOpenChange={setShowClaimPopup}
                  onClaimSuccess={() => handleClaimSuccess(selectedOffer._id)}
                />
              )}

              {/* View All Button - Only show if there are deals */}
              {flashDeals.length > 0 && (
                <div className="flex justify-center">
                  <Link href="/flashdeals">
                    <Button
                      variant="outline"
                      trailingIcon={
                        !isRTL && <ChevronRight className="w-5 h-5" />
                      }
                      leadingIcon={
                        isRTL && <ChevronRight className="w-5 h-5 rotate-180" />
                      }
                      className="px-6 sm:px-8 py-3 text-base sm:text-lg"
                    >
                      {t("viewAll") || "View All Deals"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
