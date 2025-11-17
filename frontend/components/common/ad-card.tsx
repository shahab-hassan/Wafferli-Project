"use client";
import React from "react";
import { Star, Edit, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import WishlistButton from "@/components/common/wishlist-button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Base interface for all ad types
interface BaseAdProps {
  id: string;
  type: "product" | "service" | "event" | "offer" | "explore";
  title: string;
  subtitle?: string;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;

  // Common favorite props
  isFavorited?: boolean;
  favoritesCount?: number;
  myAds?: boolean;

  // Action buttons props
  showChatButton?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onChat?: (id: string) => void;
  deleting?: boolean;
  ShowFavorite?: boolean;
  showBadge?: boolean;
}

// Product specific interface
interface ProductAdProps extends BaseAdProps {
  type: "product";
  askingPrice: number;
  discount?: boolean;
  discountPercent?: number;
  discountedPrice?: number;
  quantity?: number;
  city?: string;
  neighbourhood?: string;
}

// Service specific interface
interface ServiceAdProps extends BaseAdProps {
  type: "service";
  serviceType: string;
  duration?: string;
  price: number;
  discount?: boolean;
  discountPercent?: number;
  discountedPrice?: number;
  location?: string;
}

// Event specific interface
interface EventAdProps extends BaseAdProps {
  type: "event";
  eventDate: string;
  eventTime?: string;
  venue: string;
  price?: number;
  isFree?: boolean;
}

// Offer specific interface
interface OfferAdProps extends BaseAdProps {
  type: "offer";
  fullPrice: number;
  discount: boolean;
  discountPercent: number;
  discountedPrice?: number;
  validUntil?: string;
}

// Explore specific interface
interface ExploreAdProps extends BaseAdProps {
  type: "explore";
  location: string;
  distance?: string;
  rating: number;
  isFeatured?: boolean;
}

// Union type for all ad types
export type AdCardProps =
  | ProductAdProps
  | ServiceAdProps
  | EventAdProps
  | OfferAdProps
  | ExploreAdProps;

export default function AdCard(props: AdCardProps) {
  const {
    id,
    type,
    title,
    subtitle,
    image,
    category,
    rating = 0,
    reviewCount = 0,
    isFavorited = false,
    favoritesCount = 0,
    myAds = false,
    showChatButton = false,
    onEdit,
    onDelete,
    onChat,
    deleting,
    ShowFavorite = true,
    showBadge = true,
  } = props;

  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Helper function to get category color
  const getCategoryColor = (category: string = "") => {
    const colors = [
      { bgClass: "bg-blue-100", textClass: "text-blue-800" },
      { bgClass: "bg-green-100", textClass: "text-green-800" },
      { bgClass: "bg-purple-100", textClass: "text-purple-800" },
      { bgClass: "bg-orange-100", textClass: "text-orange-800" },
      { bgClass: "bg-pink-100", textClass: "text-pink-800" },
    ];
    const index = category.length ? category.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Helper function to get adType badge color
  const getAdTypeBadgeColor = (adType: string) => {
    const colors = {
      product: { bgClass: "bg-blue-500", textClass: "text-white" },
      service: { bgClass: "bg-green-500", textClass: "text-white" },
      event: { bgClass: "bg-purple-500", textClass: "text-white" },
      offer: { bgClass: "bg-orange-500", textClass: "text-white" },
      explore: { bgClass: "bg-pink-500", textClass: "text-white" },
    };
    return colors[adType as keyof typeof colors] || colors.product;
  };

  // Helper function to get item link based on type
  const getItemLink = (id: string, type: string) => {
    const routes = {
      product: `/product/${id}`,
      service: `/service/${id}`,
      event: `/events/${id}`,
      offer: `/offers/${id}`,
      explore: `/explore/${id}`,
    };
    return routes[type as keyof typeof routes] || `/ad/${id}`;
  };

  // Handle edit action
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  // Handle delete action
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Handle chat action
  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("You must be logged in");
      return;
    }
    if (onChat) {
      onChat(id);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price - (price * discountPercent) / 100;
  };

  // Format price without decimals
  const formatPrice = (price: number) => {
    return Math.round(price);
  };

  // Render action buttons (Edit, Delete, Chat) in card content
  const renderActionButtons = () => {
    if (!myAds && !showChatButton) return null;

    return (
      <div className="flex flex-col sm:flex-row w-full gap-2 mt-3 pt-3 border-t border-gray-200">
        {/* Edit Button */}
        {myAds && (
          <>
            <button
              onClick={handleEdit}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg 
                       bg-blue-100 text-blue-700 font-semibold text-sm 
                       hover:bg-blue-200 hover:shadow transition-all duration-200 ease-in-out active:scale-95"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg 
                       bg-red-100 text-red-700 font-semibold text-sm 
                       hover:bg-red-200 hover:shadow transition-all duration-200 ease-in-out active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? "Deleting" : "Delete"}</span>
            </button>
          </>
        )}

        {/* Chat Button */}
        {showChatButton && (
          <button
            onClick={handleChat}
            className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg 
                     bg-green-100 text-green-700 font-semibold text-sm 
                     hover:bg-green-200 hover:shadow transition-all duration-200 ease-in-out active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
        )}
      </div>
    );
  };

  // Render price section based on type
  const renderPriceSection = () => {
    switch (type) {
      case "product":
        const productProps = props as ProductAdProps;

        // Check if discount should be applied
        const hasProductDiscount =
          productProps.discount &&
          productProps.discountPercent &&
          productProps.discountPercent > 0;

        // Calculate final price
        let finalPrice = productProps.askingPrice;

        if (hasProductDiscount && productProps.discountedPrice) {
          finalPrice = productProps.discountedPrice;
        } else if (hasProductDiscount && productProps.discountPercent) {
          finalPrice = calculateDiscountedPrice(
            productProps.askingPrice,
            productProps.discountPercent
          );
        }

        return (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              {/* Original Price with strike-through if discount */}
              {hasProductDiscount ? (
                <>
                  <strike className="text-gray-500 text-sm">
                    {formatPrice(productProps.askingPrice)}{" "}
                    <span className="text-xs">KD</span>
                  </strike>

                  {/* Discounted Price */}
                  <span className="text-black-1 text-lg font-semibold">
                    {formatPrice(finalPrice)}{" "}
                    <span className="text-sm">KD</span>
                  </span>
                </>
              ) : (
                <span className="text-black-1 text-lg font-semibold">
                  {formatPrice(finalPrice)} <span className="text-sm">KD</span>
                </span>
              )}
            </div>

            {/* Discount Percentage Badge */}
            {hasProductDiscount && productProps.discountPercent && (
              <span className="text-xs text-red-600 font-semibold mt-1">
                {productProps.discountPercent}% OFF
              </span>
            )}
          </div>
        );

      case "service":
        const serviceProps = props as ServiceAdProps;

        // Check if discount should be applied
        const hasServiceDiscount =
          serviceProps.discount &&
          serviceProps.discountPercent &&
          serviceProps.discountPercent > 0;

        // Calculate final price
        let serviceFinalPrice = serviceProps.price;

        if (hasServiceDiscount && serviceProps.discountedPrice) {
          serviceFinalPrice = serviceProps.discountedPrice;
        } else if (hasServiceDiscount && serviceProps.discountPercent) {
          serviceFinalPrice = calculateDiscountedPrice(
            serviceProps.price,
            serviceProps.discountPercent
          );
        }

        return (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              {hasServiceDiscount ? (
                <>
                  <strike className="text-gray-500 text-sm">
                    {formatPrice(serviceProps.price)}{" "}
                    <span className="text-xs">KD</span>
                  </strike>
                  <span className="text-black-1 text-lg font-semibold">
                    {formatPrice(serviceFinalPrice)}{" "}
                    <span className="text-sm">KD</span>
                  </span>
                </>
              ) : (
                <span className="text-black-1 text-lg font-semibold">
                  {formatPrice(serviceFinalPrice)}{" "}
                  <span className="text-sm">KD</span>
                </span>
              )}
            </div>

            {/* Discount Percentage Badge */}
            {hasServiceDiscount && serviceProps.discountPercent && (
              <span className="text-xs text-red-600 font-semibold mt-1">
                {serviceProps.discountPercent}% OFF
              </span>
            )}
          </div>
        );

      case "event":
        const eventProps = props as EventAdProps;
        return (
          <div className="flex items-center gap-1.5">
            {eventProps.isFree || !eventProps.price ? (
              <span className="bg-success/10 text-success px-2.5 py-1 rounded-[100px] text-xs font-bold">
                FREE
              </span>
            ) : (
              <span className="text-sm font-bold text-red-300">
                {formatPrice(eventProps.price || 0)} KD
              </span>
            )}
          </div>
        );

      case "offer":
        const offerProps = props as OfferAdProps;

        // Calculate final price for offer
        let offerFinalPrice = offerProps.fullPrice;

        // Check if discount should be applied
        const hasOfferDiscount =
          offerProps.discount && offerProps.discountPercent > 0;

        if (hasOfferDiscount) {
          if (offerProps.discountedPrice) {
            offerFinalPrice = offerProps.discountedPrice;
          } else {
            offerFinalPrice = calculateDiscountedPrice(
              offerProps.fullPrice,
              offerProps.discountPercent
            );
          }
        }

        return (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-sm">
              {hasOfferDiscount ? (
                <>
                  <strike className="text-gray-500">
                    {formatPrice(offerProps.fullPrice)}
                  </strike>
                  <span className="text-black-1 font-bold">
                    {formatPrice(offerFinalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-black-1 font-bold">
                  {formatPrice(offerFinalPrice)}
                </span>
              )}
              <span className="text-purple-600">KD</span>
            </div>
            {hasOfferDiscount && (
              <span className="text-xs text-red-600 font-semibold">
                {offerProps.discountPercent}% OFF
              </span>
            )}
          </div>
        );
      case "explore":
        return (
          <div className="flex items-center gap-1.5">
            <span className="bg-success/10 text-success px-2.5 py-1 rounded-[100px] text-xs font-bold">
              EXPLORE
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  // Render type-specific details with truncation
  const renderTypeSpecificDetails = () => {
    switch (type) {
      case "product":
        const productProps = props as ProductAdProps;
        const hasProductDiscount =
          productProps.discount &&
          productProps.discountPercent &&
          productProps.discountPercent > 0;

        return (
          <>
            {hasProductDiscount && productProps.discountPercent && (
              <div className="flex mb-1">
                <span className="inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold bg-red-100 text-red-800">
                  {productProps.discountPercent}% OFF
                </span>
              </div>
            )}
            {productProps.city && productProps.neighbourhood && (
              <p className="text-xs text-grey-2 line-clamp-1 mb-1">
                {truncateText(
                  `${productProps.neighbourhood}, ${productProps.city}`,
                  30
                )}
              </p>
            )}
          </>
        );

      case "service":
        const serviceProps = props as ServiceAdProps;
        const hasServiceDiscount =
          serviceProps.discount &&
          serviceProps.discountPercent &&
          serviceProps.discountPercent > 0;

        return (
          <>
            {hasServiceDiscount && serviceProps.discountPercent && (
              <div className="flex mb-1">
                <span className="inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold bg-red-100 text-red-800">
                  {serviceProps.discountPercent}% OFF
                </span>
              </div>
            )}
            {serviceProps.serviceType && (
              <p className="text-xs text-grey-2 line-clamp-1 mb-1">
                {truncateText(serviceProps.serviceType, 25)}
              </p>
            )}
            {serviceProps.duration && (
              <p className="text-xs text-grey-2 line-clamp-1">
                ⏱ {truncateText(serviceProps.duration, 20)}
              </p>
            )}
          </>
        );

      case "event":
        const eventProps = props as EventAdProps;
        return (
          <>
            {eventProps.eventDate && (
              <p className="text-xs text-grey-2 line-clamp-1 mb-1">
                {new Date(eventProps.eventDate).toLocaleDateString()}
                {eventProps.eventTime && ` • ⏰ ${eventProps.eventTime}`}
              </p>
            )}
            {eventProps.venue && (
              <p className="text-xs text-grey-2 line-clamp-1">
                {truncateText(eventProps.venue, 25)}
              </p>
            )}
          </>
        );

      case "offer":
        const offerProps = props as OfferAdProps;
        return (
          <>
            {offerProps.discount && offerProps.discountPercent > 0 && (
              <div className="flex mb-1">
                <span className="inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold bg-red-100 text-red-800">
                  {offerProps.discountPercent}% OFF
                </span>
              </div>
            )}
            {offerProps.validUntil && (
              <p className="text-xs text-grey-2 line-clamp-1">
                Valid until{" "}
                {new Date(offerProps.validUntil).toLocaleDateString()}
              </p>
            )}
          </>
        );

      case "explore":
        const exploreProps = props as ExploreAdProps;
        return (
          <>
            {exploreProps.isFeatured && (
              <span className="inline-block px-2 py-1 rounded-[100px] text-[10px] font-semibold bg-yellow-100 text-yellow-800 mb-1">
                FEATURED
              </span>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // Main card content
  const renderCardContent = () => {
    const categoryColor = getCategoryColor(category);
    const adTypeBadgeColor = getAdTypeBadgeColor(type);

    return (
      <div className="p-3 flex flex-col h-full">
        <div className="flex-1">
          {/* Ad Type Badge - Show only if showBadge is true */}
          {showBadge && (
            <div className="flex justify-between items-start mb-2">
              {/* Category */}
              {category && (
                <span
                  className={cn(
                    "inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold",
                    categoryColor.bgClass,
                    categoryColor.textClass
                  )}
                >
                  {truncateText(category, 15)}
                </span>
              )}

              {/* Ad Type Badge */}
              <span
                className={cn(
                  "inline-block px-2 py-1 rounded text-[10px] font-semibold capitalize",
                  adTypeBadgeColor.bgClass,
                  adTypeBadgeColor.textClass
                )}
              >
                {type}
              </span>
            </div>
          )}

          {/* Type-specific details */}
          <div className="mb-2">{renderTypeSpecificDetails()}</div>

          {/* Title & Subtitle */}
          <div className="mb-3">
            <h3 className="text-small-semibold text-black-1 line-clamp-2 leading-tight mb-1">
              {truncateText(title, 60)}
            </h3>
            {subtitle && (
              <p className="text-xs text-grey-2 line-clamp-2 leading-relaxed">
                {truncateText(subtitle, 80)}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              <span className="text-sm font-bold text-black-1">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-grey-2 font-normal">
                ({reviewCount})
              </span>
            </div>

            {/* Price Section */}
            {renderPriceSection()}
          </div>

          {/* Action Buttons */}
          {renderActionButtons()}
        </div>
      </div>
    );
  };

  return (
    <div className="block transition-opacity duration-200 hover:opacity-95 !w-full">
      <div className="group relative w-full max-w-[320px] bg-white rounded-[12px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <Link href={getItemLink(id, type)} className="flex-shrink-0">
          <div className="relative h-[145px] overflow-hidden bg-grey-5">
            <img
              src={image || "/placeholder.svg?height=145&width=320"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {ShowFavorite && (
              <div className="absolute top-2 right-2">
                <WishlistButton adId={id} isFavorited={isFavorited} />
              </div>
            )}
          </div>
        </Link>

        {/* Dynamic Content Section - Flexible Height */}
        <div className="flex-grow min-h-[180px]">{renderCardContent()}</div>
      </div>
    </div>
  );
}
