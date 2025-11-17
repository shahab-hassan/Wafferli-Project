"use client";
import type React from "react";
import { Heart, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import WishlistButton from "../common/wishlist-button";
import Image from "next/image";

export interface MarketplaceProductCardProps {
  data: {
    id: string;
    name: string;
    brand: string;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number;
    isFavorited?: boolean;

    discount?: number;
    description: string;
    sellerName: string;
    sellerLogo: string;
    location: string;
    category: string;
    subcategory: string;
  };
  className?: string;
}

export function MarketplaceProductCard({
  data,
  className,
}: MarketplaceProductCardProps) {
  const t = useTranslations();

  const {
    id,
    name,
    image,
    rating,
    reviewCount,
    price,
    originalPrice,
    isFavorited,
    discount,
    description,
    sellerName,
    location,
    category,
    subcategory,
    sellerLogo,
  } = data;

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Chat with sellerName:", sellerName);
  };

  return (
    <Link
      href={`/product/${id}`}
      className={cn(
        "group relative rounded-[14px] overflow-visible border border-grey-200 transition-all duration-200 hover:shadow-md",
        "w-full max-w-[340px]",
        className
      )}
    >
      {/* IMAGE AREA */}
      <div className="relative h-[170px] bg-grey-100 overflow-visible rounded-t-[14px]">
        <img
          src={image || "/placeholder.svg?height=200&width=320"}
          alt={name}
          className="w-full h-full object-cover rounded-t-[14px] group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-4">
          <WishlistButton adId={id} isFavorited={isFavorited} />
        </div>
        {discount && (
          <div className="absolute left-4 top-4 inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full shadow-sm z-30">
            <span className="text-sm font-semibold">{discount}% OFF</span>
          </div>
        )}{" "}
        {/* RATING */}
        <div
          className="absolute right-4 bottom-0 -translate-y-1/4 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm z-30"
          role="img"
          aria-label={`rating ${rating}`}
        >
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-semibold text-black-1">
            {rating?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-4 pt-6 pb-4">
        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
            {category}
          </span>

          <span className="text-[11px] font-medium bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full">
            {subcategory}
          </span>
        </div>

        {/* Title + Description */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-black-1 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-grey-2 mt-1 line-clamp-2">{description}</p>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-baseline gap-3">
            <div className="text-2xl font-extrabold text-primary">
              {price} KD
            </div>
            {originalPrice && (
              <div className="text-sm text-grey-2 line-through">
                {originalPrice} KD
              </div>
            )}
            {discount && (
              <div className="text-sm font-semibold text-green-600">
                -{discount}%
              </div>
            )}
          </div>
        </div>

        {/* SellerName */}
        <div className="flex items-center gap-3 mt-4 mb-3">
          {sellerLogo ? (
            <>
              <Image src={sellerLogo} alt="" width={20} height={30} />
            </>
          ) : (
            <div className="w-7 h-7 bg-grey-4 rounded-full flex items-center justify-center">
              <span className="text-xs text-grey-2 font-medium">
                {sellerName?.charAt(0) ?? "S"}
              </span>
            </div>
          )}
          <div>
            <div className="text-sm text-grey-2">{sellerName}</div>
          </div>
        </div>

        {/* Chat button - full-width rounded-full */}
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
