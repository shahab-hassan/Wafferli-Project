"use client";

import { useLocale } from "next-intl";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { DeletedAd, GetMyAds } from "@/features/slicer/AdSlice";
import { useEffect, useState } from "react";
import AdCard from "@/components/common/ad-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/common/badge";
import { useRouter } from "next/navigation";

export default function AllMyAdsPage() {
  const locale = useLocale();
  const dispatch = useDispatch();
  const router = useRouter();

  const [myAds, setMyAds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const types = [
    { key: "all", label: "All" },
    { key: "product", label: "Product" },
    { key: "service", label: "Service" },
    { key: "offer", label: "Offer" },
    { key: "explore", label: "Explore" },
    { key: "event", label: "Event" },
  ];

  // Get ads count by type
  const getAdsCountByType = (type: string) => {
    if (type === "all") return myAds.length;
    return myAds.filter((ad) => ad.adType === type).length;
  };

  // Filter ads based on active tab
  const getFilteredAds = () => {
    if (activeTab === "all") return myAds;
    return myAds.filter((ad) => ad.adType === activeTab);
  };

  const filteredAds = getFilteredAds();
  console.log(filteredAds, "filteredAds");
  // Fetch ads
  const getMyAds = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetMyAds() as any).unwrap();
      console.log(res, "res");
      setMyAds(res.data.ads || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyAds();
  }, []);

  // Handle Edit
  const handleEdit = (item: any) => {
    router.push(`edit-ad/${item._id}`);
  };

  // Handle Delete
  const handleDelete = async (item: any) => {
    try {
      setDeleting(true);
      const res = await dispatch(DeletedAd(item._id) as any).unwrap();
      if (res.success) {
        setMyAds((prev) => prev.filter((ad) => ad._id !== item._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={clsx("container mx-auto p-4 mt-2 max-w-[1440px] w-full")}>
      <h1 className="text-2xl font-bold mb-6">My Ads</h1>

      {/* Tabs Header */}
      <div className="mb-8">
        <div
          role="tablist"
          className="flex flex-wrap gap-2 sm:gap-3 border-b pb-2"
        >
          {types.map((type) => (
            <button
              key={type.key}
              role="tab"
              aria-selected={activeTab === type.key}
              onClick={() => setActiveTab(type.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                activeTab === type.key
                  ? "border-transparent bg-primary text-white shadow-md"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              )}
            >
              <span>{type.label}</span>
              <Badge
                className={cn(
                  "rounded-full text-xs min-w-6 h-6 flex items-center justify-center",
                  activeTab === type.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {getAdsCountByType(type.key)}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Ads Grid */}
      {!loading && filteredAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {activeTab === "all"
              ? "You haven't created any ads yet."
              : `No ${activeTab} ads found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAds.map((item: any, index: number) => (
            <AdCard
              key={item._id || index}
              id={item._id}
              type={item.adType}
              title={item.adType === "explore" ? item.exploreName : item.title}
              subtitle={
                item.adType === "explore"
                  ? item.exploreDescription
                  : item.description
              }
              image={item.images?.[0] || "/placeholder.svg"}
              category={item.category || item.eventType || item.serviceType}
              rating={item.rating}
              reviewCount={item.reviewsCount}
              askingPrice={item.askingPrice}
              price={
                item.askingPrice ? `${item.askingPrice}` : item.servicePrice
              }
              fullPrice={item.fullPrice}
              discount={item.discount || item.discountDeal}
              discountPercent={item.discountPercent}
              eventDate={item.eventDate}
              eventTime={item.eventTime}
              serviceType={item.serviceType}
              location={item.city}
              isFavorited={item.isFavorited}
              favoritesCount={item.favoritesCount}
              myAds={true}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
              deleting={deleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
