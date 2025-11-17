"use client";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/common/button";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdCard from "@/components/common/ad-card";

interface RelatedProduct {
  _id: string;
  title: string;
  images: string[];
  description: string;
  askingPrice?: number;
  discount?: boolean;
  discountPercent?: number | null;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  neighbourhood?: string;
  adType?: string;
  isFavorited?: boolean;
  quantity?: number;
  // Event specific fields
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  featuresAmenities?: string[];
  // Explore specific fields
  exploreName?: string;
  exploreDescription?: string;
  startTime?: string;
  endTime?: string;
}

interface RelatedOffersProps {
  relatedProducts?: RelatedProduct[];
  title?: string;
  adType?: "product" | "event" | "explore";
  seller?: any;
}

export default function RelatedOffers({
  relatedProducts = [],
  title = "You Might Also Like",
  adType = "product",
  seller,
}: RelatedOffersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Transform API data to appropriate card format based on adType
  const transformData = (product: RelatedProduct) => {
    const baseData = {
      id: product._id,
      title: truncateText(product.title, 80), // Truncate title to 50 chars
      description: product.description,
      location: `${product.city || ""} ${product.neighbourhood || ""}`.trim(),
    };

    const calculateCurrentPrice = () => {
      if (
        product.discountPercent &&
        product.askingPrice &&
        product.discountPercent > 0
      ) {
        const discountAmount =
          product.askingPrice * (product.discountPercent / 100);
        const currentPrice = product.askingPrice - discountAmount;
        return Math.round(currentPrice);
      }
      return product.askingPrice || 0;
    };

    switch (adType) {
      case "product":
        return {
          type: "product" as const,
          id: product._id,
          title: truncateText(product.title, 80),
          image: product.images?.[0] || "/placeholder.svg",
          rating: product.rating || 0,
          reviewCount: product.reviewsCount || 0,
          askingPrice: calculateCurrentPrice(),
          discount: product.discount,
          discountPercent: product.discountPercent || undefined,
          category: product.category || "General",
          city: product.city,
          neighbourhood: product.neighbourhood,
          isFavorited: product.isFavorited,
          description: product.description,
          // For AdCard props
          subtitle: truncateText(product.description, 80), // Truncate description to 80 chars
          favoritesCount: 0,
          showBadge: false,
          showChatButton: true,
        };

      case "event":
        return {
          type: "event" as const,
          id: product._id,
          title: truncateText(product.title, 80),
          image: product.images?.[0] || "/placeholder.svg",
          rating: product.rating || 0,
          reviewCount: product.reviewsCount || 0,
          isFavorited: product.isFavorited,
          description: product.description,
          location: `${product.city || ""} ${
            product.neighbourhood || ""
          }`.trim(),
          eventDate: product.eventDate || "", // Provide empty string as fallback
          eventTime: product.eventTime,
          venue: product.neighbourhood || product.city || "Unknown Venue", // Provide fallback
          eventType: product.eventType,
          // For AdCard props
          subtitle: truncateText(product.description, 80),
          favoritesCount: 0,
          ShowFavorite: true,
          showBadge: false,
          price: product.askingPrice || 0,
          isFree: !product.askingPrice || product.askingPrice === 0,
          showChatButton: true,
        };

      case "explore":
        return {
          type: "explore" as const,
          id: product._id,
          title: truncateText(
            product.title || product.exploreName || "Explore",
            80
          ),
          image: product.images?.[0] || "/placeholder.svg",
          rating: product.rating || 0,
          reviewCount: product.reviewsCount || 0,
          description: product.description || product.exploreDescription,
          isFavorited: product.isFavorited,
          location: `${product.city || ""} ${
            product.neighbourhood || ""
          }`.trim(),
          exploreName: product.exploreName,
          exploreDescription: product.exploreDescription,
          startTime: product.startTime,
          endTime: product.endTime,
          // For AdCard props
          subtitle: truncateText(
            product.description || product.exploreDescription || "",
            80
          ),
          favoritesCount: 0,
          ShowFavorite: true,
          showBadge: false,
          isFeatured: false,
          showChatButton: true,
        };

      default:
        return {
          type: "product" as const,
          id: product._id,
          title: truncateText(product.title, 80),
          image: product.images?.[0] || "/placeholder.svg",
          description: product.description,
          subtitle: truncateText(product.description, 80),
          rating: product.rating || 0,
          reviewCount: product.reviewsCount || 0,
          ShowFavorite: true,
          showBadge: false,
          favoritesCount: 0,
          showChatButton: true,
        };
    }
  };

  const offers = relatedProducts.map(transformData);

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [offers]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.children[0]?.getBoundingClientRect().width ||
        280;
      const gap =
        parseFloat(getComputedStyle(scrollContainerRef.current).gap) || 16;
      const scrollAmount = cardWidth + gap;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.children[0]?.getBoundingClientRect().width ||
        280;
      const gap =
        parseFloat(getComputedStyle(scrollContainerRef.current).gap) || 16;
      const scrollAmount = cardWidth + gap;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => Math.min(prev + 1, offers.length - 1));
    }
  };

  if (offers.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl lg:rounded-3xl border">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            {title}
          </h3>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex flex-row gap-4 lg:gap-6 overflow-x-auto max-w-7xl mx-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-4"
          >
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="w-[280px] flex-shrink-0 snap-start"
              >
                <AdCard {...offer} />
              </div>
            ))}
          </div>

          {isScrollable && offers.length > 0 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-4">
                <Button
                  variant="ghost"
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md border border-primary disabled:opacity-50 w-10 h-10 md:w-12 md:h-12"
                  onClick={scrollLeft}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4">
                <Button
                  variant="ghost"
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md border border-primary disabled:opacity-50 w-10 h-10 md:w-12 md:h-12"
                  onClick={scrollRight}
                  disabled={currentIndex >= offers.length - 1}
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
