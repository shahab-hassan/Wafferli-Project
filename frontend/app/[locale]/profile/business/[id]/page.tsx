"use client";

import { useParams } from "next/navigation";
import LocationSection from "@/components/marketplace/location-section";
import AdsGrid from "@/components/profile/ads-grid";
import BusinessSidebar from "@/components/profile/business-sidebar";
import BusinessHero from "@/components/profile/business-hero";
import { useDispatch } from "react-redux";
import { GetSellerDetails } from "@/features/slicer/AdSlice";
import { useEffect, useState } from "react";

export default function BusinessProfilePage() {
  const params = useParams();
  const [business, setBusiness] = useState<any>([]);
  const sellerId = params.id;
  console.log(sellerId);
  const dispatch = useDispatch();

  const fetchSellerDetail = async () => {
    const res = await dispatch(
      GetSellerDetails({ sellerId, page: 1, limit: 10 }) as any
    ).unwrap();
    if (res.success) {
      setBusiness(res.data);
    }
  };

  useEffect(() => {
    fetchSellerDetail();
  }, []);
  console.log(business);
  const sellerData = business?.seller || [];
  const ads = business?.ads || [];

  console.log(sellerData, "sellerData");
  console.log(ads, "ads");
  return (
    <div className="min-h-screen bg-background">
      {sellerData.businessType === "seller" && (
        <BusinessHero sellerData={sellerData} />
      )}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6 order-last lg:order-none">
            <AdsGrid business={ads} />
            <LocationSection
              business={{
                name: sellerData?.name || "Business",
                address: `${sellerData.city || "N/A"}, ${
                  sellerData.neighbourhood || "N/A"
                }`,
                coordinates: { lat: 29.3759, lng: 47.9774 }, // Kuwait City default
              }}
            />{" "}
          </div>
          <div className="lg:col-span-1 order-first lg:order-none">
            <BusinessSidebar seller={sellerData} adDat={ads} />
          </div>
        </div>
      </div>
    </div>
  );
}
