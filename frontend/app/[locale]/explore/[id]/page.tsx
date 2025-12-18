"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Star,
} from "lucide-react";
import { Badge } from "@/components/common/badge";
import { Card, CardContent } from "@/components/common/shadecn-card";
import ShareAdButton from "@/components/common/ShareAdButton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFeaturedExploreDetails,
} from "@/features/slicer/AdSlice";
import { RootState } from "@/features/store/store";
import ReviewsSection from "@/components/marketplace/reviews-section";
import BusinessSidebar from "@/components/marketplace/business-sidebar";
import LocationSection from "@/components/marketplace/location-section";
import WishlistButton from "@/components/common/wishlist-button";
import RelatedOffers from "@/components/marketplace/related-items";

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const adId = resolvedParams?.id as string;

  // Resolve params using useEffect for Next.js 15
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const fetchExploreDetails = async () => {
    if (!resolvedParams?.id) return;

    setLoading(true);
    try {
      await dispatch(
        GetFeaturedExploreDetails(resolvedParams.id) as any
      ).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreDetails();
  }, [resolvedParams]);

  const featuredExploreDetails = useSelector(
    (state: RootState) => state.ad.featuredExploreDetails
  );

  // Extract data from API response
  const responseData = featuredExploreDetails as any;

  const exploreData = responseData?.explore || {};
  const sellerData = responseData?.seller || {};
  const relatedPlaces = responseData?.relatedExploreAds || [];

  console.log(featuredExploreDetails, "featuredExploreDetails");

  // Show loading while params are being resolved or data is loading
  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!exploreData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Place not found
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-3xl">
              <div className="relative h-96">
                {exploreData.images?.[0] ? (
                  <Image
                    src={
                      exploreData.images[currentImageIndex] ||
                      exploreData.images[0]
                    }
                    alt={
                      exploreData.exploreName ||
                      exploreData.title ||
                      "Explore Place"
                    }
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
                <div className="absolute top-4 left-4"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <WishlistButton
                    adId={adId}
                    isFavorited={exploreData.isFavorited}
                  />

                  <ShareAdButton
                    adId={adId}
                    title={exploreData.exploreName || exploreData.title}
                    className="hover:scale-110"
                  />
                </div>
              </div>
            </Card>
            {/* Place Info */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      {exploreData.exploreName || exploreData.title || "N/A"}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {/* STATIC Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {exploreData.rating}
                        </span>
                        <span>{exploreData.ratingCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {exploreData.city || "N/A"},{" "}
                          {exploreData.neighbourhood || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {exploreData.exploreDescription ||
                    exploreData.description ||
                    "No description available"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {exploreData.showPhone
                        ? exploreData.phone || "N/A"
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
                name: sellerData?.name || "Business",
                address: `${exploreData.city || "N/A"}, ${
                  exploreData.neighbourhood || "N/A"
                }`,
                coordinates: { lat: 29.3759, lng: 47.9774 }, // Kuwait City default
              }}
            />{" "}
            {/* Details Tabs */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="details" className="rounded-xl">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl">
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="rounded-xl">
                      Photos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">City:</span>
                            <p className="font-medium">
                              {exploreData.city || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Neighbourhood:
                            </span>
                            <p className="font-medium">
                              {exploreData.neighbourhood || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Opening Hours:
                            </span>
                            <p className="font-medium">
                              {exploreData.startTime || "N/A"} -{" "}
                              {exploreData.endTime || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Contact:</span>
                            <p className="font-medium">
                              {exploreData.showPhone
                                ? exploreData.phone || "N/A"
                                : "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <ReviewsSection adId={adId!} />
                  </TabsContent>

                  <TabsContent value="photos" className="mt-6">
                    {exploreData?.images && exploreData?.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {exploreData.images.map((img, index) => (
                          <div key={index} className="relative h-32">
                            <Image
                              src={img}
                              alt={`${
                                exploreData.exploreName || exploreData.title
                              } photo ${index + 1}`}
                              fill
                              className="rounded-xl object-cover"
                            />
                          </div>
                        ))}
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
            <BusinessSidebar seller={sellerData} adData={exploreData} />
          </div>
        </div>
      </div>

      {/* Related Places */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <RelatedOffers relatedProducts={relatedPlaces} adType="explore" />
      </div>
    </div>
  );
}
