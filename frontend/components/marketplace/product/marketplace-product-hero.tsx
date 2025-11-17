"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { useDispatch, useSelector } from "react-redux";
import { checkFavoriteStatus, toggleFavorite } from "@/features/slicer/AdSlice";
import ShareAdButton from "@/components/common/ShareAdButton";
import WishlistButton from "@/components/common/wishlist-button";

interface MarketplaceProductHeroProps {
  product: {
    _id: string;
    title: string;
    description: string;
    images: string[];
    discount?: boolean;
    discountPercent?: number;
    askingPrice?: number;
    discountedPrice?: number;
    rating?: number;
    reviewsCount?: number;
    category?: string;
    subCategory?: string;
    condition?: string;
  };
  adId: string;
}

export default function MarketplaceProductHero({
  product,
  adId,
}: MarketplaceProductHeroProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const { isFavorited, isLoading } = useSelector((state: any) => state.ad);
  const [localLoading, setLocalLoading] = useState(false);

  // Check favorite status on component mount
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        setLocalLoading(true);
        await dispatch(checkFavoriteStatus(adId) as any).unwrap();
      } catch (error) {
        console.error("Error checking favorite status:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    if (adId) {
      checkFavorite();
    }
  }, [adId, dispatch]);

  const toggleWishlist = async () => {
    if (!adId || isLoading || localLoading) return;

    try {
      setLocalLoading(true);
      const res = await dispatch(toggleFavorite(adId) as any).unwrap();

      if (res.success) {
        console.log("Favorite toggled successfully:", res.data);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const isButtonLoading = isLoading || localLoading;
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + (product.images?.length || 1)) %
        (product.images?.length || 1)
    );
  };

  const hasImages = product.images && product.images.length > 0;
  const images = hasImages ? product.images : ["/placeholder.svg"];

  return (
    <>
      {/* Breadcrumb */}
      <div className="my-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {product.title || "Product Name"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {product.description || "Product description"}
        </p>
      </div>

      <section className="relative">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-gray-100">
          {/* Image Carousel */}
          <div className="relative h-full">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Image Navigation Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "bg-primary w-8"
                        : "bg-white/60 w-2 hover:bg-primary/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Top Actions */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              {product.discount && product.discountPercent && (
                <Badge className="bg-primary text-white rounded-full px-3 py-1 text-sm font-bold">
                  {product.discountPercent}% OFF
                </Badge>
              )}

              <div className="flex space-x-2">
                <WishlistButton adId={adId} />

                <ShareAdButton
                  adId={adId}
                  title={product.title}
                  className="hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
