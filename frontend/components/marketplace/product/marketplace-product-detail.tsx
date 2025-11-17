"use client";

import { Card, CardContent } from "@/components/common/shadecn-card";
import { Badge } from "@/components/common/badge";
import { Star, MapPin, Clock, Shield, Truck } from "lucide-react";

interface MarketplaceProductDetailsProps {
  product: {
    _id: string;
    title: string;
    description: string;
    category?: string;
    subCategory?: string;
    askingPrice?: number;
    discountedPrice?: number;
    originalPrice?: number;
    discount?: boolean;
    discountPercent?: number;
    rating?: number;
    reviewsCount?: number;
    quantity?: number;
    recurring?: boolean;
    paymentMode?: string;
    condition?: string;
    city?: string;
    neighbourhood?: string;
    phone?: string;
    showPhone?: boolean;
  };
}

export default function MarketplaceProductDetails({
  product,
}: MarketplaceProductDetailsProps) {
  const displayPrice = product.discountedPrice || product.askingPrice || 0;
  const originalPrice = product.originalPrice || product.askingPrice || 0;
  const hasDiscount = product.discount && product.discountPercent;

  return (
    <Card className="rounded-2xl lg:rounded-3xl">
      <CardContent className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl font-bold text-foreground">
              Price : {displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  Price : {originalPrice.toFixed(2)}
                </span>
                <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-bold">
                  Save {product.discountPercent}%
                </Badge>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating || 0}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{product.category || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subcategory:</span>
                <span className="font-medium">
                  {product.subCategory || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condition:</span>
                <span className="font-medium">
                  {product.condition || "New"}
                </span>
              </div>
              {product.quantity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">
                    {product.quantity} available
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Seller Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {product.city || "N/A"}, {product.neighbourhood || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Posted recently</span>
              </div>
              {product.showPhone && product.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{product.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Fast Delivery</span>
            </div>
            {product.recurring && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span>Recurring</span>
              </div>
            )}
            {product.paymentMode && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>{product.paymentMode} Payment</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
