"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MapPin,
  ExternalLink,
  Star,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { Button } from "@/components/common/button";
import { useRouter } from "next/navigation";

export default function BusinessSidebar({ seller, adData }: any) {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(seller, " seller in sidebar");
  console.log(adData, " adData in sidebar");

  // 🔹 Safely extract values from seller data
  const avatar = seller?.userDetails?.fullName
    ? seller.userDetails.fullName.charAt(0).toUpperCase()
    : seller?.name?.charAt(0).toUpperCase() || "B";

  const businessData = {
    id: seller?._id || "N/A",
    name: seller?.userDetails?.fullName || seller?.name || "Business Name",
    logo: seller?.logo && seller.logo.trim() !== "" ? seller.logo : "",
    description: seller?.description || "No description available",
    avatar,
    address: `${seller?.neighbourhood || ""}${
      seller?.neighbourhood && seller?.city ? ", " : ""
    }${seller?.city || ""}`,
    fullAddress: `${seller?.neighbourhood || ""}${
      seller?.neighbourhood && seller?.city ? ", " : ""
    }${seller?.city || ""}`,
    phone: adData?.showPhone
      ? adData.phone ?? "Phone not shown"
      : seller?.userDetails?.phone ?? "Phone not shown",
    website: seller?.website || "",
    rating: adData?.rating || 0,
    reviewCount: adData?.reviewCount || 0,
    socialLinks: {
      facebook: seller?.socialLinks?.facebook || "",
      instagram: seller?.socialLinks?.instagram || "",
      twitter: seller?.socialLinks?.twitter || "",
    },
    memberSince: seller?.stats?.memberSince
      ? new Date(seller.stats.memberSince).toLocaleDateString()
      : "N/A",
    totalAds: seller?.stats?.totalAds || 0,
    coordinates: {
      lat:
        seller?.coordinates?.lat ||
        (seller?.city === "Kuwait City" ? 29.3759 : 29.3117),
      lng:
        seller?.coordinates?.lng ||
        (seller?.city === "Kuwait City" ? 47.9774 : 47.4818),
    },
  };

  const displayRating = Math.floor(businessData.rating);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  };

  // Calculate travel time based on distance
  const calculateTravelTime = (distance: number): string => {
    const averageSpeed = 40; // km/h average city speed
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);

    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Get user's location - SILENT ERROR HANDLING
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    const geoSuccess = (position: GeolocationPosition) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setUserLocation({ lat: userLat, lng: userLng });

      // Calculate distance
      const dist = calculateDistance(
        userLat,
        userLng,
        businessData.coordinates.lat,
        businessData.coordinates.lng
      );
      setDistance(dist);

      // Calculate travel time
      const time = calculateTravelTime(dist);
      setTravelTime(time);

      setLoading(false);
    };

    const geoError = (error: GeolocationPositionError) => {
      // SILENT ERROR HANDLING - no console errors, no state changes
      setLoading(false);
    };

    // Less intrusive geolocation options
    const options = {
      enableHighAccuracy: false,
      timeout: 5000, // 5 seconds
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, options);
  }, []);

  // 🔹 Event handlers
  const handlePhoneCall = () => {
    if (
      businessData.phone !== "Phone not shown" &&
      businessData.phone !== "N/A"
    ) {
      window.location.href = `tel:${businessData.phone}`;
    }
  };

  const handleWebsiteVisit = () => {
    if (!businessData.website) return;
    const websiteUrl = businessData.website.startsWith("http")
      ? businessData.website
      : `https://${businessData.website}`;
    window.open(websiteUrl, "_blank", "noopener,noreferrer");
  };

  const handleSocialClick = (platform: string, url: string) => {
    if (!url) return;

    let socialUrl = url;
    if (!url.startsWith("http")) {
      const urls: Record<string, string> = {
        facebook: `https://facebook.com/${url}`,
        instagram: `https://instagram.com/${url}`,
        twitter: `https://twitter.com/${url}`,
      };
      socialUrl = urls[platform] || url;
    }

    window.open(socialUrl, "_blank", "noopener,noreferrer");
  };

  const handleGetDirections = () => {
    if (userLocation) {
      // Open Google Maps with directions from user location to business
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${businessData.coordinates.lat},${businessData.coordinates.lng}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      // Just show the business location on Google Maps
      const url = `https://www.google.com/maps?q=${businessData.coordinates.lat},${businessData.coordinates.lng}`;
      window.open(url, "_blank");
    }
  };

  const handleChat = () => {
    if (adData?._id) {
      router.push(`/chat/${adData._id}`);
    }
  };

  // Format description with proper line breaks
  const formatDescription = (desc: string) => {
    if (!desc || desc === "No description available") return desc;
    return desc.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < desc.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Card className="rounded-2xl lg:rounded-3xl border sticky top-4 lg:top-8 shadow-sm">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* ---------- Business Header ---------- */}
        <div className="text-center mb-6">
          {/* Logo or Avatar */}
          {businessData.logo ? (
            <div className="relative inline-block mb-4 hover:scale-105 transition-transform duration-300">
              <Image
                src={businessData.logo}
                alt={businessData.name}
                width={80}
                height={80}
                className="rounded-full mx-auto w-16 h-16 lg:w-20 lg:h-20 object-cover shadow-md border border-gray-200"
              />
            </div>
          ) : (
            <div className="rounded-full bg-purple-300 mx-auto w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center text-gray-700 text-2xl font-semibold shadow-sm mb-4">
              {businessData.avatar}
            </div>
          )}

          {/* Name */}
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 hover:text-gray-600 transition-colors cursor-pointer">
            {businessData.name}
          </h3>

          {/* Description */}
          <div className="text-sm text-gray-600 mb-3 text-center leading-relaxed max-h-20 overflow-y-auto">
            {formatDescription(businessData.description)}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < displayRating
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-gray-500">
              ({businessData.reviewCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* ---------- Contact Info ---------- */}
        <div className="space-y-3 mb-6">
          {/* Phone */}
          <button
            onClick={handlePhoneCall}
            disabled={
              businessData.phone === "Phone not shown" ||
              businessData.phone === "N/A"
            }
            className="flex items-center space-x-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 font-medium text-sm">
              {businessData.phone}
            </span>
          </button>

          {/* Address with Distance Info */}
          <div className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-700 text-sm leading-relaxed block">
                {businessData.fullAddress || "Address not available"}
              </span>
              {!loading && userLocation && distance && travelTime && (
                <div className="text-xs text-green-600 mt-1">
                  📍 {distance} km away • 🕒 {travelTime}
                </div>
              )}
              {!loading && !userLocation && (
                <div className="text-xs text-gray-500 mt-1">
                  Enable location to see distance
                </div>
              )}
            </div>
          </div>

          {/* Website */}
          {businessData.website && (
            <button
              onClick={handleWebsiteVisit}
              className="flex items-center space-x-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm truncate">
                {businessData.website.replace(/^https?:\/\//, "")}
              </span>
            </button>
          )}
        </div>

        {/* ---------- Social Links ---------- */}
        {(businessData.socialLinks.facebook ||
          businessData.socialLinks.instagram ||
          businessData.socialLinks.twitter) && (
          <div className="flex justify-center space-x-3 mb-6">
            {businessData.socialLinks.facebook && (
              <button
                onClick={() =>
                  handleSocialClick(
                    "facebook",
                    businessData.socialLinks.facebook
                  )
                }
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
            )}
            {businessData.socialLinks.instagram && (
              <button
                onClick={() =>
                  handleSocialClick(
                    "instagram",
                    businessData.socialLinks.instagram
                  )
                }
                className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-all duration-200 hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
            )}
            {businessData.socialLinks.twitter && (
              <button
                onClick={() =>
                  handleSocialClick("twitter", businessData.socialLinks.twitter)
                }
                className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ---------- Buttons ---------- */}
        <div className="grid grid-cols-1 gap-3 text-center mb-4">
          <Button
            onClick={handleChat}
            variant="primary"
            leadingIcon={<MessageCircle className="w-4 h-4" />}
            className="w-full"
            disabled={!adData?._id}
          >
            Chat
          </Button>
          <Button
            onClick={handleGetDirections}
            variant="outline"
            leadingIcon={<Send className="w-4 h-4" />}
            className="w-full"
          >
            Get Directions
          </Button>
        </div>

        {/* ---------- Footer Stats ---------- */}
        <div className="flex justify-between items-center border-t pt-3 text-gray-500 text-xs">
          <div>
            <span className="font-medium text-gray-700">
              Joined: {businessData.memberSince}
            </span>
          </div>
          <div>
            <span className="font-semibold text-indigo-600">
              {businessData.totalAds}
            </span>{" "}
            Ads Posted
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
