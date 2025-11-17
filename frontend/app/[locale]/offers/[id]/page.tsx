"use client";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import {
  GetFeaturedProductDetails,
  GetOfferDetails,
} from "@/features/slicer/AdSlice";
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
import RelatedOffers from "@/components/marketplace/related-items";
import { set } from "date-fns";
import OfferHero from "@/components/offers-page/offer-id/offerhero";
import OfferDetails from "@/components/offers-page/offer-id/offer-details";

export default function OfferDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = use(params) as { id: string };
  const adId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offerDetails, setOfferDetails] = useState(null);
  const dispatch = useDispatch();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await dispatch(GetOfferDetails(adId) as any).unwrap();
      setOfferDetails(res.data);
      console.log(res, "res");
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

  const responseData = offerDetails as any;

  console.log(responseData, "responseData");
  const offerData = responseData?.offer || {};
  const sellerData = responseData?.seller || {};
  const relatedOffers = responseData?.relatedOffers || [];
  const ratingDistribution = responseData?.ratingDistribution || {};
  const userData = responseData?.user || [];

  console.log(sellerData, "sellerData");
  console.log(relatedOffers, "relatedOffers");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!offerData._id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The offer you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfferHero offer={offerData} />
      {/* Main Content */}{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {" "}
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-8">
            {" "}
            <OfferDetails offer={offerData} />{" "}
            <LocationSection
              business={{
                name: offerData?.name || "Seller",
                address: `${offerData.city || "N/A"}, ${
                  offerData.neighbourhood || "N/A"
                }`,
                coordinates: { lat: 29.3759, lng: 47.9774 },
              }}
            />{" "}
            <ReviewsSection adId={offerData._id} />
          </div>{" "}
          {/* Sidebar */}{" "}
          <div className="lg:block">
            {" "}
            <BusinessSidebar seller={sellerData} adData={offerData} />{" "}
          </div>{" "}
        </div>{" "}
        {/* Related Offers */}{" "}
        <div className="mt-8 lg:mt-16">
          {" "}
          <RelatedOffers offers={relatedOffers} />{" "}
        </div>{" "}
      </div>
    </div>
  );
}
