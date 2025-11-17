"use client";
import { MapPin, Navigation, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { useState, useEffect } from "react";

interface LocationSectionProps {
  business: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

export default function LocationSection({ business }: LocationSectionProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  // Calculate distance between two coordinates using Haversine formula
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
    return R * c;
  };

  // Calculate estimated travel time (assuming 40 km/h average speed in city)
  const calculateTravelTime = (distanceKm: number): number => {
    const averageSpeed = 40; // km/h
    return (distanceKm / averageSpeed) * 60; // convert to minutes
  };

  useEffect(() => {
    // Get user's current location
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
        business.coordinates.lat,
        business.coordinates.lng
      );
      setDistance(dist);

      // Calculate travel time
      const time = calculateTravelTime(dist);
      setTravelTime(time);

      setLoading(false);
    };

    const geoError = (error: GeolocationPositionError) => {
      // Silent error handling - no console errors, no state changes for errors
      // Just stop loading and continue without user location
      setLoading(false);
    };

    // Add timeout for geolocation request
    const options = {
      enableHighAccuracy: false, // Set to false to be less intrusive
      timeout: 5000, // 5 seconds - shorter timeout
      maximumAge: 300000, // 5 minutes - use cached location
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, options);
  }, [business.coordinates]);

  const handleGetDirections = () => {
    // Always use Google Maps, with or without user location
    if (userLocation) {
      // Open directions from user location to business
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${business.coordinates.lat},${business.coordinates.lng}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      // Just show the business location and let user enter their own location
      const url = `https://www.google.com/maps/dir//${business.coordinates.lat},${business.coordinates.lng}`;
      window.open(url, "_blank");
    }
  };

  const formatDistance = (dist: number | null): string => {
    if (dist === null) return "Calculate distance";
    if (dist < 1) return `${Math.round(dist * 1000)} m away`;
    return `${dist.toFixed(1)} km away`;
  };

  const formatTime = (time: number | null): string => {
    if (time === null) return "Est. time";
    if (time < 1) return "< 1 min drive";
    return `${Math.round(time)} min drive`;
  };

  return (
    <Card className="bg-white border">
      <CardContent className="p-0">
        <h3 className="px-2 sm:px-3 lg:px-4 pt-4 sm:pt-2 lg:pt-4 text-lg sm:text-xl font-bold text-gray-900 mb-2 lg:mb-4">
          Location & Directions
        </h3>

        {/* Map section with OpenStreetMap */}
        <div className="relative h-70 sm:h-60 lg:h-100 rounded-2xl overflow-hidden mb-4 lg:mb-6 px-2">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              business.coordinates.lng - 0.01
            }%2C${business.coordinates.lat - 0.01}%2C${
              business.coordinates.lng + 0.01
            }%2C${business.coordinates.lat + 0.01}&layer=mapnik&marker=${
              business.coordinates.lat
            }%2C${business.coordinates.lng}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title={`Location of ${business.name}`}
            loading="lazy"
          ></iframe>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button
              variant="primary"
              onClick={handleGetDirections}
              className="flex-1"
            >
              <Navigation className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Get Directions
            </Button>

            <div className="flex items-center justify-center sm:justify-start space-x-3 lg:space-x-4 text-gray-600 text-sm lg:text-base">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    <span>{formatDistance(distance)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    <span>{formatTime(travelTime)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
