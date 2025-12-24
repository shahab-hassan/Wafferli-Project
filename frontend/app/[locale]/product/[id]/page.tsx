"use client";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import { GetFeaturedProductDetails } from "@/features/slicer/AdSlice";
import { MapPin, Star, Phone, Globe } from "lucide-react";
import WishlistButton from "@/components/common/wishlist-button";
import ShareAdButton from "@/components/common/ShareAdButton";
import { Badge } from "@/components/common/badge";
import { Card, CardContent } from "@/components/common/shadecn-card";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs";
import BusinessSidebar from "@/components/marketplace/business-sidebar";
import LocationSection from "@/components/marketplace/location-section";
import ReviewsSection from "@/components/marketplace/reviews-section";
import RelatedProducts from "@/components/marketplace/related-items";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = use(params) as { id: string };
  const adId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      await dispatch(GetFeaturedProductDetails(adId) as any).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adId) {
      fetchProductDetails();
    }
  }, [adId]);

  const featuredProductDetails = useSelector(
    (state: RootState) => state.ad.featuredProductDetails
  );

  const responseData = featuredProductDetails as any;

  const productData = responseData?.product || {};
  const sellerData = responseData?.seller || {};
  const relatedProducts = responseData?.relatedProducts || [];
  const ratingDistribution = responseData?.ratingDistribution || {};
  const userData = responseData.user || [];
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!productData._id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-3xl shadow-sm">
              <div className="relative h-80 md:h-[520px]">
                {productData.images?.[0] ? (
                  <Image
                    src={
                      productData.images[currentImageIndex] ||
                      productData.images[0]
                    }
                    alt={productData.title || "Product"}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}

                {/* Image Navigation */}
                {productData.images && productData.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {productData.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Top Badges and Actions */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-purple-100 text-purple-700 backdrop-blur-sm">
                    {productData.category || "Product"}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <WishlistButton
                    adId={adId}
                    isFavorited={productData.isFavorited}
                  />
                  <ShareAdButton
                    adId={adId}
                    title={productData.title}
                    className="hover:scale-110"
                  />
                </div>
              </div>
            </Card>

            {/* Product Info */}
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {productData.title || "Product Title"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {productData.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span>({productData.reviewsCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {productData.city || "N/A"},{" "}
                        {productData.neighbourhood || "N/A"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {productData.description || "No description available"}
                  </p>
                </div>
                {/* Price Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm text-gray-600">Price:</span>

                    {productData.discount ? (
                      <>
                        {/* 🔹 Discounted & Original Prices */}
                        <div className="flex items-center gap-3 mt-1">
                          {/* Final Discounted Price */}
                          <p className="text-3xl font-semibold text-purple-600">
                            ${productData.discountedPrice || "0"}
                            <span className="text-lg">KD</span>
                          </p>

                          {/* Original (Asking) Price */}
                          {productData.askingPrice && (
                            <strike className="text-xl text-gray-500">
                              ${productData.askingPrice}
                              <span className="text-lg">KD</span>
                            </strike>
                          )}
                        </div>

                        {/* 🔹 Discount Percentage */}
                        {productData.discountPercent && (
                          <p className="text-sm text-red-500 mt-1 font-medium">
                            Save {productData.discountPercent}% OFF
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {/* 🔹 Simple Price (No Discount) */}
                        <div className="mt-1">
                          <p className="text-3xl font-semibold text-gray-800">
                            ${productData.askingPrice || "0"}
                            <span className="text-lg">KD</span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {productData.showPhone
                        ? productData.phone || "N/A"
                        : "Phone not shown"}
                    </span>
                  </div>
                  {sellerData?.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <a
                        href={`https://${sellerData.website}`}
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sellerData.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Section */}
            <LocationSection
              business={{
                name: productData?.name || "Seller",
                address: `${productData.city || "N/A"}, ${
                  productData.neighbourhood || "N/A"
                }`,
                coordinates: { lat: 29.3759, lng: 47.9774 }, // Kuwait City default
              }}
            />

            {/* Details Tabs */}
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gray-100 p-1">
                    <TabsTrigger
                      value="details"
                      className="rounded-xl data-[state=active]:bg-white"
                    >
                      Product Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-xl data-[state=active]:bg-white"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="photos"
                      className="rounded-xl data-[state=active]:bg-white"
                    >
                      Photos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">
                          Product Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">
                                {productData.category || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Sub Category:
                              </span>
                              <span className="font-medium">
                                {productData.subCategory || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">
                                {productData.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-right">
                                {productData.city || "N/A"},{" "}
                                {productData.neighbourhood || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Contact:</span>
                              <span className="font-medium">
                                {productData.showPhone
                                  ? productData.phone || "N/A"
                                  : "Not available"}
                              </span>
                            </div>
                            {productData.paymentMode && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment:</span>
                                <span className="font-medium capitalize">
                                  {productData.paymentMode}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      {Object.keys(ratingDistribution).length > 0 && (
                        <div className="border-t pt-6">
                          <h4 className="font-semibold mb-3 text-lg">
                            Rating Breakdown
                          </h4>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div
                                key={rating}
                                className="flex items-center gap-3"
                              >
                                <div className="flex items-center gap-1 w-16">
                                  <span className="text-sm text-gray-600">
                                    {rating}
                                  </span>
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        ((ratingDistribution[rating] || 0) /
                                          (productData.reviewsCount || 1)) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                  {ratingDistribution[rating] || 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <ReviewsSection adId={adId} />
                  </TabsContent>

                  <TabsContent value="photos" className="mt-6">
                    {productData.images && productData.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {productData.images.map(
                          (img: string, index: number) => (
                            <div
                              key={index}
                              className="relative h-42 rounded-lg overflow-hidden"
                            >
                              <Image
                                src={img}
                                alt={`${productData.title} photo ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => setCurrentImageIndex(index)}
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No photos available
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <BusinessSidebar seller={sellerData} adData={productData} />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts
            relatedProducts={relatedProducts}
            adType="product"
            seller={sellerData}
            title="Related Products"
          />
        </div>
      </div>
    </div>
  );
}
