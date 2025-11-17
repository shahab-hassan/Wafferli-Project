"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { BillingPlanCards } from "@/components/post-ad/billing-plan-cards";
import { Card } from "@/components/common/shadecn-card";
import { Separator } from "@/components/common/separator";
import { Button } from "@/components/common/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BackLink } from "@/components/common/back-link";
import { CreateAd, setAdData, resetAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import toast from "react-hot-toast";
import {
  EventAdData,
  ExploreAdData,
  OfferAdData,
  ProductAdData,
  ServiceAdData,
} from "@/types/ad";

export default function BillingPage() {
  const dispatch = useDispatch();
  const { adData, isLoading, isError, errorMessage } = useSelector(
    (state: RootState) => state.ad
  );
  const router = useRouter();

  React.useEffect(() => {
    if (isError && errorMessage) {
      toast.error(errorMessage);
      if (errorMessage.includes("Validation failed")) {
        router.push(`/post-ad/${adData.type}`);
      }
    }
  }, [isError, errorMessage, router, adData.type]);

  const handleSubmit = async () => {
    console.log(adData, "adData");
    if (!adData.type) {
      toast.error("Ad type is required");
      return;
    }
    if (!adData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!adData.description?.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!/^\+\d{1,3}\d{6,12}$/.test(adData.phone)) {
      toast.error(
        "Phone number must be in international format (e.g., +923001234567)"
      );
      return;
    }
    if (adData.locationSameAsProfile) {
    } else {
      if (!adData.city?.trim()) {
        toast.error("Please select a city");
        return;
      }

      if (!adData.neighbourhood?.trim()) {
        toast.error("Please enter neighbourhood area");
        return;
      }
    }

    const formData = new FormData();
    const appendIfValid = (key: string, value: any) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(
          key,
          typeof value === "boolean" ? String(value) : value
        );
      }
    };

    appendIfValid("adType", adData.type);
    appendIfValid("title", adData.title);
    appendIfValid("description", adData.description);
    appendIfValid("locationSameAsProfile", adData.locationSameAsProfile);
    appendIfValid("city", adData.city);
    appendIfValid("neighbourhood", adData.neighbourhood);
    appendIfValid("phone", adData.phone);
    appendIfValid("showPhone", adData.showPhone);
    appendIfValid("paymentMode", adData.paymentMode);

    // Validate and append images
    if (adData.images?.length) {
      adData.images.forEach((image, index) => {
        if (image instanceof File && image.size > 0) {
          formData.append("images", image);
        } else {
          console.warn(`Skipping invalid image at index ${index}`);
        }
      });
    }

    if (adData.type === "product") {
      const productData = adData as ProductAdData;

      // Required fields validation
      if (!productData.category?.trim()) {
        toast.error("Category is required for product ads");
        return;
      }
      if (!productData.subCategory?.trim()) {
        toast.error("Subcategory is required for product ads");
        return;
      }
      if (!productData.askingPrice || productData.askingPrice <= 0) {
        toast.error("Asking price must be a positive number");
        return;
      }
      if (
        productData.recurring &&
        (!productData.quantity || productData.quantity <= 0)
      ) {
        toast.error(
          "Quantity must be a positive number for recurring products"
        );
        return;
      }
      if (
        productData.discount &&
        (productData.discountPercent === null ||
          productData.discountPercent < 0 ||
          productData.discountPercent > 100)
      ) {
        toast.error("Discount percent must be between 0 and 100");
        return;
      }

      // Append product-specific fields
      appendIfValid("category", productData.category);
      appendIfValid("subCategory", productData.subCategory);
      appendIfValid("recurring", productData.recurring);
      if (productData.quantity !== null) {
        appendIfValid("quantity", productData.quantity);
      }
      appendIfValid("askingPrice", productData.askingPrice);
      appendIfValid("discount", productData.discount);
      if (productData.discountPercent !== null) {
        appendIfValid("discountPercent", productData.discountPercent);
      }
    } else if (adData.type === "event") {
      const eventData = adData as EventAdData;

      // Required fields validation
      if (!eventData.eventType?.trim()) {
        toast.error("Event type is required");
        return;
      }
      if (!eventData.eventDate) {
        toast.error("Event date is required");
        return;
      }
      if (!eventData.eventTime) {
        toast.error("Event start time is required");
        return;
      }
      if (!eventData.endTime) {
        toast.error("Event end time is required");
        return;
      }
      if (eventData.eventTime >= eventData.endTime) {
        toast.error("End time must be after start time");
        return;
      }

      // Check if event date is in the future
      const eventDateTime = new Date(
        `${eventData.eventDate}T${eventData.eventTime}`
      );
      if (eventDateTime <= new Date()) {
        toast.error("Event date and time must be in the future");
        return;
      }

      // Append event-specific fields
      appendIfValid("eventType", eventData.eventType);
      appendIfValid("eventDate", eventData.eventDate);
      appendIfValid("eventTime", eventData.eventTime);
      appendIfValid("endTime", eventData.endTime);

      // Append features
      if (eventData.features?.length) {
        eventData.features.forEach((feature: any) => {
          if (feature?.trim()) formData.append("featuresAmenities", feature);
        });
      }
    } else if (adData.type === "offer") {
      const offerData = adData as OfferAdData;
      if (
        !offerData.expiryDate ||
        isNaN(new Date(offerData.expiryDate).getTime()) ||
        new Date(offerData.expiryDate) <= new Date()
      ) {
        toast.error("Expiry date must be a valid future date");
        return;
      }
      if (offerData.category === null || !offerData.category?.trim()) {
        toast.error("category is required");
        return;
      }

      if (offerData.fullPrice === null || offerData.fullPrice <= 0) {
        toast.error("Full price must be a positive number");
        return;
      }
      appendIfValid("expiryDate", offerData.expiryDate);
      appendIfValid("flashDeal", offerData.flashDeal);
      appendIfValid("discountDeal", offerData.discountDeal);
      appendIfValid("category", offerData.category);
      appendIfValid("fullPrice", offerData.fullPrice);

      if (offerData.discountDeal) {
        if (
          offerData.discountPercent === null ||
          offerData.discountPercent < 0 ||
          offerData.discountPercent > 100
        ) {
          toast.error("Discount percent must be between 0 and 100");
          return;
        }
        appendIfValid("discountPercent", offerData.discountPercent);
      } else {
        if (
          !offerData.offerDetail?.trim() ||
          offerData.offerDetail.length > 70
        ) {
          toast.error("Offer detail must be 1-70 characters");
          return;
        }
        appendIfValid("offerDetail", offerData.offerDetail);
      }
    } else if (adData.type === "explore") {
      const exploreData = adData as ExploreAdData;
      if (
        !exploreData.exploreName?.trim() ||
        exploreData.exploreName.length > 70
      ) {
        toast.error("Explore name must be 1-70 characters");
        return;
      }
      if (
        !exploreData.exploreDescription?.trim() ||
        exploreData.exploreDescription.length > 1000
      ) {
        toast.error("Explore description must be 1-1000 characters");
        return;
      }
      if (!exploreData.startTime || !exploreData.endTime) {
        toast.error("Start time and end time are required");
        return;
      }

      appendIfValid("exploreName", exploreData.exploreName);
      appendIfValid("exploreDescription", exploreData.exploreDescription);
      appendIfValid("startTime", exploreData.startTime);
      appendIfValid("endTime", exploreData.endTime);
    } else if (adData.type === "service") {
      const serviceData = adData as ServiceAdData;

      // Required fields validation
      if (!serviceData.category?.trim()) {
        toast.error("Category is required for service ads");
        return;
      }
      if (!serviceData.subCategory?.trim()) {
        toast.error("Subcategory is required for service ads");
        return;
      }

      if (!serviceData.serviceType?.trim()) {
        toast.error("Service Type is required for service ads");
        return;
      }

      if (!serviceData.servicePrice) {
        toast.error("Service Price is required for service ads");
        return;
      }

      // Append service-specific fields
      appendIfValid("category", serviceData.category);
      appendIfValid("subCategory", serviceData.subCategory);
      appendIfValid("serviceType", serviceData.serviceType);
      appendIfValid("servicePrice", serviceData.servicePrice);
    }

    // Log FormData contents before sending
    const formDataEntries: Record<string, any> = {};
    formData.forEach((value, key) => {
      formDataEntries[key] = value instanceof File ? value.name : value;
    });
    console.log("📤 Final FormData:", formDataEntries);

    const res = await dispatch(CreateAd(formData) as any).then(
      (result: any) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(resetAdData());
          router.push("/post-ad/success");
        }
      }
    );
  };

  const basePrice = 8;
  const annualDiscountPercent = 20;
  const annualBase = basePrice * 12;
  const annualAfterDiscount = annualBase * (1 - annualDiscountPercent / 100);

  const totalDisplay =
    adData.paymentMode === "monthly"
      ? { label: "Total", value: `${basePrice} KD / mo`, strike: undefined }
      : {
          label: "Total",
          value: `${annualAfterDiscount.toFixed(1)} KD / yr`,
          strike: `${annualBase} KD`,
        };

  return (
    <PageContainer>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Select Payment Mode</h2>
        <BillingPlanCards
          value={adData.paymentMode || "monthly"}
          onChange={(value) => dispatch(setAdData({ paymentMode: value }))}
        />
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-base font-semibold">Pricing Overview</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Base Price ({adData.type || "Ad"})
              </div>
              <div className="text-base font-semibold">{basePrice} KD</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Annual Discount
              </div>
              <div className="text-base font-semibold">
                {annualDiscountPercent}%
              </div>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium">{totalDisplay.label}</div>
              <div className="space-x-2">
                {totalDisplay.strike && (
                  <span className="text-sm text-muted-foreground line-through">
                    {totalDisplay.strike}
                  </span>
                )}
                <span className="text-base font-semibold text-primary">
                  {totalDisplay.value}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {isError && errorMessage && (
          <Card className="rounded-2xl border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </Card>
        )}

        <div className="mt-6 flex items-center justify-end">
          <Button
            variant="primary"
            className="rounded-full px-6"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post Ad"}
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
