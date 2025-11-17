// Updated ProductCard component
"use client";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import WishlistButton from "@/components/common/wishlist-button";

const categoryColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-info/20 text-info",
  "bg-success/20 text-success ",
  "bg-failure/20 text-failure",
  "bg-warning/20 text-warning",
];

const getRandomCategoryColor = (category: string) => {
  const hash = category.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a;
  }, 0);

  const colorIndex = Math.abs(hash) % categoryColors.length;
  const selectedColor = categoryColors[colorIndex];

  const [bgClass, textClass] = selectedColor.split(" ");

  return {
    bgClass,
    textClass,
  };
};

export function ProductCard({
  id,
  title,
  subtitle,
  image,
  category,
  rating,
  reviewCount,
  price,
  className,
}: any) {
  // Create wishlist item

  console.log(
    id,
    title,
    subtitle,
    image,
    category,
    rating,
    reviewCount,
    price,
    className
  );
  const categoryColor = getRandomCategoryColor(category);

  return (
    <div
      className={cn(
        "group relative w-[260px] h-[280px] bg-white rounded-[12px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-[145px] overflow-hidden bg-grey-5">
        <img
          src={
            image ||
            "/placeholder.svg?height=145&width=320&query=scenic landscape"
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <WishlistButton adId={id} />
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2.5">
        {/* Category */}
        <div className="flex">
          <span
            className={cn(
              "inline-block px-3 py-1.5 rounded-[100px] text-[10px] font-semibold",
              categoryColor.bgClass,
              categoryColor.textClass
            )}
          >
            {category}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-0.5">
          <h3 className="text-small-semibold text-black-1 line-clamp-1 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-grey-2 line-clamp-2 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-sm font-bold text-black-1">{rating}</span>
            <span className="text-xs text-grey-2 font-normal">
              ({reviewCount})
            </span>
          </div>

          {/* Distance & Price */}
          <div className="flex items-center gap-1.5">
            {!price ? (
              <span className="bg-success/10 text-success px-2.5 py-1 rounded-[100px] text-xs font-bold">
                FREE
              </span>
            ) : (
              <span className="text-sm font-bold text-black-1">{price}</span>
            )}
            {/* <span className="text-xs text-grey-2 font-normal">{distance}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
