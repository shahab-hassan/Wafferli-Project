"use client";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import { GetFeaturedExplore } from "@/features/slicer/AdSlice";
import AdCard, { AdCardProps } from "@/components/common/ad-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EmptyState from "./EmptyState";

export default function ExploreSection() {
  const dispatch = useDispatch();
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const fetchExploreData = async () => {
    try {
      await dispatch(GetFeaturedExplore() as any).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  const featuredExploreAds = useSelector(
    (state: RootState) => state.ad.featuredExploreAds
  );

  // ✅ Transform API data
  const exploreItems: AdCardProps[] =
    featuredExploreAds?.map((ad: any) => ({
      id: ad._id,
      type: "explore",
      title: ad.title,
      subtitle: ad.description,
      image: ad.images?.[0] || "/placeholder.svg?height=145&width=320",
      category: ad.city,
      rating: ad.rating || 0,
      reviewCount: ad.reviewsCount || 0,
      price: ad.price,
      exploreName: ad.exploreName,
      exploreDescription: ad.exploreDescription,
      location: ad.city,
      isFavorited: ad.isFavorited || false,
      favoritesCount: ad.favoritesCount || 0,
    })) || [];

  // ✅ Show message when no product found
  if (exploreItems.length === 0) {
    return (
      <EmptyState
        title="Oops! No Items Here"
        message="Please check back later or try refreshing the page."
      />
    );
  }

  return (
    <div className="mb-10">
      <div className="w-full">
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
              1536: { slidesPerView: 4, spaceBetween: 24 },
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            className="mySwiper"
          >
            {exploreItems.map((item) => (
              <SwiperSlide key={item.id}>
                <AdCard {...item} />
              </SwiperSlide>
            ))}

            {/* Navigation Buttons */}
            <button
              ref={navigationPrevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 text-primary hover:bg-primary hover:text-white hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                />
              </svg>
            </button>
            <button
              ref={navigationNextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 text-primary hover:bg-primary hover:text-white hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                />
              </svg>
            </button>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
