"use client";

import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Calendar,
  Users,
  Wifi,
  Car,
  CreditCard,
  Baby,
  ShipWheelIcon as Wheelchair,
  Coffee,
  Music,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { Card, CardContent } from "@/components/common/shadecn-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ShareAdButton from "@/components/common/ShareAdButton";
import BusinessSidebar from "@/components/marketplace/business-sidebar";
import LocationSection from "@/components/marketplace/location-section";
import RelatedOffers from "@/components/marketplace/related-items";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import { GetFeaturedEventDetails } from "@/features/slicer/AdSlice";
import WishlistButton from "@/components/common/wishlist-button";
import ReviewsSection from "@/components/marketplace/reviews-section";

// Icon mapping for amenities
const iconMap: { [key: string]: any } = {
  "Free Parking": Car,
  "WiFi Available": Wifi,
  "Family Friendly": Baby,
  "Wheelchair Accessible": Wheelchair,
  "Food & Drinks": Utensils,
  "Live Music": Music,
  "Air Conditioned": Coffee,
  "Outdoor Seating": Coffee,
  "Indoor Venue": Coffee,
  "Valet Parking": Car,
};

const AmenityIcon = ({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    return <div className={`w-4 h-4 bg-gray-300 rounded ${className}`} />;
  }
  return <IconComponent className={className} />;
};

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const adId = resolvedParams.id;
  const dispatch = useDispatch();

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      await dispatch(GetFeaturedEventDetails(adId) as any).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adId) {
      fetchEventDetails();
    }
  }, [adId]);

  const featuredEventDetails = useSelector(
    (state: RootState) => state.ad.featuredEventDetails
  );

  const responseData = featuredEventDetails as any;
  const eventData = responseData?.event || {};
  const sellerData = responseData?.seller || {};
  const relatedEvents = responseData?.relatedEvents || [];
  const ratingDistribution = responseData?.ratingDistribution || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!eventData._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The event you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Format event date and time
  const eventDateTime = eventData.formattedEventDate
    ? `${eventData.formattedEventDate} at ${
        eventData.formattedEventTime || eventData.startTime
      }`
    : "Date not specified";

  // Get event type display name
  const getEventTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      concert: "Concert",
      sports: "Sports Event",
      exhibition: "Exhibition",
      festival: "Festival",
      conference: "Conference",
      workshop: "Workshop",
      party: "Party",
      other: "Event",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-3xl shadow-sm">
              <div className="relative h-80 md:h-96">
                {eventData.images?.[0] ? (
                  <Image
                    src={
                      eventData.images[currentImageIndex] || eventData.images[0]
                    }
                    alt={eventData.title || "Event"}
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
                {eventData.images && eventData.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {eventData.images.map((_, index) => (
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
                    {getEventTypeDisplay(eventData.eventType)}
                  </Badge>
                  {eventData.isUpcoming && (
                    <Badge className="bg-green-100 text-green-700 backdrop-blur-sm">
                      Upcoming
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <WishlistButton
                    adId={adId}
                    isFavorited={eventData.isFavorited}
                  />
                  <ShareAdButton
                    adId={adId}
                    title={eventData.title}
                    className="hover:scale-110"
                  />
                </div>
              </div>
            </Card>

            {/* Event Info */}
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {eventData.title || "Event Title"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {eventData.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span>({eventData.reviewsCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {eventData.city || "N/A"},{" "}
                        {eventData.neighbourhood || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{eventDateTime}</span>
                    </div>
                    {eventData.daysUntilEvent && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-orange-600 font-medium">
                          {eventData.daysUntilEvent} days to go
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {eventData.description || "No description available"}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {eventData.showPhone
                        ? eventData.phone || "N/A"
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

                {/* Features/Amenities */}
                {eventData.featuresAmenities &&
                  eventData.featuresAmenities.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 text-lg">
                        Event Features & Amenities
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {eventData.featuresAmenities.map(
                          (amenity: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <AmenityIcon
                                iconName={amenity}
                                className="w-4 h-4 text-green-600"
                              />
                              <span>{amenity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Location Section */}
            <LocationSection
              business={{
                name: sellerData?.name || "Event Organizer",
                address: `${eventData.city || "N/A"}, ${
                  eventData.neighbourhood || "N/A"
                }`,
                coordinates: { lat: 29.3759, lng: 47.9774 },
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
                      Event Details
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
                          Event Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Event Type:</span>
                              <span className="font-medium">
                                {getEventTypeDisplay(eventData.eventType)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Date & Time:
                              </span>
                              <span className="font-medium text-right">
                                {eventDateTime}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span
                                className={`font-medium ${
                                  eventData.isUpcoming
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {eventData.isUpcoming
                                  ? "Upcoming"
                                  : "Past Event"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-right">
                                {eventData.city || "N/A"},{" "}
                                {eventData.neighbourhood || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Contact:</span>
                              <span className="font-medium">
                                {eventData.showPhone
                                  ? eventData.phone || "N/A"
                                  : "Not available"}
                              </span>
                            </div>
                            {eventData.paymentMode && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment:</span>
                                <span className="font-medium capitalize">
                                  {eventData.paymentMode}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      {ratingDistribution && (
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
                                          (eventData.reviewsCount || 1)) *
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
                    {eventData.images && eventData.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {eventData.images.map((img: string, index: number) => (
                          <div
                            key={index}
                            className="relative h-32 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`${eventData.title} photo ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => setCurrentImageIndex(index)}
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
            <BusinessSidebar seller={sellerData} adData={eventData} />
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <RelatedOffers
            relatedProducts={relatedEvents}
            title="Related Events"
            adType="event"
          />
        </div>
      </div>
    </div>
  );
}
