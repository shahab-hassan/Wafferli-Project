"use client";
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
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

interface BusinessSidebarProps {
  seller: any;
  adData: any;
}

export default function BusinessSidebar({
  seller,
  adData,
}: BusinessSidebarProps) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Helper function to calculate travel time
  const calculateTravelTime = (distance: number): string => {
    const averageSpeed = 40; // km/h average speed
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

  // Get business coordinates from seller or adData
  const getBusinessCoordinates = () => {
    // Try seller coordinates first
    if (seller?.coordinates?.lat && seller?.coordinates?.lng) {
      return seller.coordinates;
    }
    // Try adData coordinates
    if (adData?.coordinates?.lat && adData?.coordinates?.lng) {
      return adData.coordinates;
    }
    // Try location from address (fallback - you can implement geocoding here)
    if (seller?.city) {
      // This is a simple fallback - in real app, you'd use a geocoding service
      return {
        lat: 29.3759, // Example coordinates for Kuwait
        lng: 47.9774,
      };
    }
    return null;
  };

  // Get user's location - SILENT ERROR HANDLING
  useEffect(() => {
    const businessCoords = getBusinessCoordinates();
    if (!businessCoords) {
      setLoading(false);
      return;
    }

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
        businessCoords.lat,
        businessCoords.lng
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
  }, [seller, adData]);

  // 🔹 Safely extract values from seller data
  const avatar = seller?.userDetails?.fullName
    ? seller.userDetails.fullName.charAt(0).toUpperCase()
    : seller?.name
    ? seller.name.charAt(0).toUpperCase()
    : "B";

  const businessData = {
    id: seller?._id || "N/A",
    name: seller?.userDetails?.fullName || seller?.name || "Business Name",
    logo: seller?.logo && seller.logo.trim() !== "" ? seller.logo : "",
    avatar,
    address: `${seller?.neighbourhood || "N/A"}, ${seller?.city || "N/A"}`,
    fullAddress:
      seller?.fullAddress ||
      `${seller?.neighbourhood || ""}, ${seller?.city || ""}`.trim(),
    phone: adData?.showPhone
      ? adData?.phone ?? "Phone not shown"
      : seller?.userDetails?.phone ?? "Phone not shown",
    website: seller?.website || "",
    rating: adData?.rating || seller?.rating || 0,
    reviewCount: adData?.reviewCount || seller?.reviewCount || 0,
    socialLinks: {
      facebook: seller?.socialLinks?.facebook || "",
      instagram: seller?.socialLinks?.instagram || "",
      twitter: seller?.socialLinks?.twitter || "",
    },
    memberSince: seller?.stats?.memberSince
      ? new Date(seller.stats.memberSince).toLocaleDateString()
      : seller?.createdAt
      ? new Date(seller.createdAt).toLocaleDateString()
      : "N/A",
    totalAds: seller?.stats?.totalAds || 0,
    coordinates: getBusinessCoordinates(),
  };

  const displayRating = Math.floor(businessData.rating);

  // 🔹 Event handlers
  const handlePhoneCall = () => {
    if (
      businessData.phone &&
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

  const handleSocialClick = (platform: string, username: string) => {
    if (!username) return;
    const urls: Record<string, string> = {
      facebook: `https://facebook.com/${username}`,
      instagram: `https://instagram.com/${username}`,
      twitter: `https://twitter.com/${username}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const handleGetDirections = () => {
    const businessCoords = getBusinessCoordinates();

    if (businessCoords?.lat && businessCoords?.lng) {
      if (userLocation) {
        // Open Google Maps with directions from user location to business
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${businessCoords.lat},${businessCoords.lng}&travelmode=driving`;
        window.open(url, "_blank");
      } else {
        // Just show the business location on Google Maps
        const url = `https://www.google.com/maps?q=${businessCoords.lat},${businessCoords.lng}`;
        window.open(url, "_blank");
      }
    } else {
      // Fallback to address-based directions
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        businessData.address
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to start a chat");
      return;
    }

    if (adData?._id) {
      router.push(`/chat/${adData._id}`);
    } else {
      toast.error("Unable to start chat");
    }
  };

  // Debug log to check coordinates
  console.log("Business Coordinates:", getBusinessCoordinates());
  console.log("User Location:", userLocation);
  console.log("Distance:", distance);

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
          <Link href={`/profile/business/${businessData.id}`}>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 hover:text-gray-600 transition-colors cursor-pointer">
              {businessData.name}
            </h3>
          </Link>

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

        {/* ---------- Location with Distance ---------- */}
        <div className="flex items-start space-x-2 mb-4 p-2 rounded-lg">
          <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-gray-700 text-sm leading-relaxed block">
              {businessData.fullAddress ||
                businessData.address ||
                "Address not available"}
            </span>
            {!loading && userLocation && distance !== null && travelTime && (
              <div className="text-xs text-green-600 mt-1">
                {distance} km away • {travelTime}
              </div>
            )}
            {!loading && userLocation && distance === null && (
              <div className="text-xs text-gray-500 mt-1">
                Calculating distance...
              </div>
            )}
            {!loading && !userLocation && (
              <div className="text-xs text-gray-500 mt-1">
                Enable location to see distance
              </div>
            )}
            {loading && (
              <div className="text-xs text-gray-500 mt-1">
                Getting location...
              </div>
            )}
          </div>
        </div>

        {/* ---------- Contact Info ---------- */}
        <div className="space-y-3 mb-6">
          {/* Phone */}
          <button
            onClick={handlePhoneCall}
            disabled={
              !businessData.phone ||
              businessData.phone === "Phone not shown" ||
              businessData.phone === "N/A"
            }
            className="flex items-center space-x-2 w-full text-left p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 font-medium text-sm">
              {businessData.phone}
            </span>
          </button>

          {/* Website */}
          {businessData.website && (
            <button
              onClick={handleWebsiteVisit}
              className="flex items-center space-x-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm truncate">
                {businessData.website}
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
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
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
                className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </button>
            )}
            {businessData.socialLinks.twitter && (
              <button
                onClick={() =>
                  handleSocialClick("twitter", businessData.socialLinks.twitter)
                }
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
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
          <p>
            Joined:{" "}
            <span className="font-medium text-gray-700">
              {businessData.memberSince}
            </span>
          </p>
          <p>
            <span className="font-semibold text-indigo-600">
              {businessData.totalAds}
            </span>{" "}
            Ads
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
