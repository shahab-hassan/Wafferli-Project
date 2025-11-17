"use client";

import * as React from "react";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { cn } from "@/lib/utils";
import { MapPin, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/common/textarea";
import { ExploreAdData } from "@/types/ad";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import { setAdData, UpdatedAd } from "@/features/slicer/AdSlice";
import toast from "react-hot-toast";

type Values = {
  exploreName: string;
  exploreDescription: string;
  startTime?: string;
  endTime?: string;
};

export function EditExploreInfoForm({}: {}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const { Ad, adData } = useSelector((state: any) => state.ad);
  const router = useRouter();

  // Get ad data from Redux or localStorage
  const myAd = React.useMemo(() => {
    const adLocalStorage = localStorage.getItem("myAd");
    const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;
    return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
  }, [Ad]);

  console.log(myAd, "✅ myAd (final usable data)");
  console.log(adData, "adData");

  // ✅ FIXED: Time conversion function - Handle both 24-hour and AM/PM formats
  const formatTimeForInput = (timeString: string): string => {
    if (!timeString) return "";

    console.log(`🕒 Formatting time: "${timeString}"`);

    // If already in correct format for input[type="time"] (HH:MM), return as is
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      console.log(`✅ Already in 24-hour format: ${timeString}`);
      return timeString;
    }

    // If in 12-hour format with AM/PM, convert to 24-hour
    const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (time) {
      let hours = parseInt(time[1]);
      const minutes = time[2];
      const period = time[3].toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
      console.log(`🔄 Converted ${timeString} to ${formattedTime}`);
      return formattedTime;
    }

    // If it's just hours without minutes, add minutes
    if (/^\d{1,2}$/.test(timeString)) {
      const formattedTime = `${timeString.padStart(2, "0")}:00`;
      console.log(`🔄 Added minutes to ${timeString}: ${formattedTime}`);
      return formattedTime;
    }

    console.log(`❌ Could not format time: ${timeString}`);
    return timeString; // Return original if can't format
  };

  // ✅ FIXED: Initialize values with proper time formatting
  const values = {
    exploreName: adData?.exploreName || myAd?.exploreName || "",
    exploreDescription:
      adData?.exploreDescription || myAd?.exploreDescription || "",
    startTime: adData?.startTime
      ? formatTimeForInput(adData.startTime)
      : myAd?.startTime
      ? formatTimeForInput(myAd.startTime)
      : "",
    endTime: adData?.endTime
      ? formatTimeForInput(adData.endTime)
      : myAd?.endTime
      ? formatTimeForInput(myAd.endTime)
      : "",
  };

  // Debug time values
  React.useEffect(() => {
    console.log("🕒 Time values debug:", {
      backendStartTime: myAd?.startTime,
      backendEndTime: myAd?.endTime,
      formattedStartTime: values.startTime,
      formattedEndTime: values.endTime,
      adDataStartTime: adData?.startTime,
      adDataEndTime: adData?.endTime,
    });
  }, [myAd, adData, values.startTime, values.endTime]);

  // Type-safe setField function
  const setField = <K extends keyof ExploreAdData>(
    key: K,
    value: ExploreAdData[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  const nameLimit = 70;
  const descLimit = 1024;

  // Validation functions
  const isNameValid =
    values.exploreName.trim().length > 0 &&
    values.exploreName.trim().length <= nameLimit;

  const isexploreDescriptionValid =
    values.exploreDescription.trim().length > 0 &&
    values.exploreDescription.trim().length <= descLimit;

  const hasTimings = !!values.startTime && !!values.endTime;

  // Time validation - check if end time is after start time
  const areTimesValid = () => {
    if (!values.startTime || !values.endTime) return true; // Don't validate if not both filled

    try {
      const [startHours, startMinutes] = values.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = values.endTime.split(":").map(Number);

      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      return endTotal > startTotal;
    } catch (error) {
      return false;
    }
  };

  const isFormValid =
    isNameValid && isexploreDescriptionValid && hasTimings && areTimesValid();

  // Error messages
  const getTimeError = () => {
    if (!values.startTime && !values.endTime)
      return "Please select both start and end times";
    if (!values.startTime) return "Please select start time";
    if (!values.endTime) return "Please select end time";
    if (!areTimesValid()) return "End time must be after start time";
    return null;
  };

  const timeError = getTimeError();

  const handleUpdate = async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      const formData = new FormData();

      // Append basic ad data
      formData.append("adType", adData.type || "");
      formData.append("title", adData.title || "");
      formData.append("description", adData.description || "");
      formData.append(
        "locationSameAsProfile",
        String(adData.locationSameAsProfile || true)
      );
      formData.append("city", adData.city || "");
      formData.append("neighbourhood", adData.neighbourhood || "");
      formData.append("phone", adData.phone || "");
      formData.append("showPhone", String(adData.showPhone !== false));

      // ✅ FIXED: Append time fields as they are (24-hour format)
      formData.append("exploreName", adData.exploreName);
      formData.append("startTime", values.startTime); // Directly use formatted time
      formData.append("endTime", values.endTime); // Directly use formatted time
      formData.append("exploreDescription", adData.exploreDescription || "");

      // ✅ Append new images as files
      if (adData.newImages?.length) {
        adData.newImages.forEach((image: any, index: number) => {
          if (image instanceof File && image.size > 0) {
            formData.append("images", image);
          }
        });
      }

      // ✅ Send removed images indices
      if (adData.removedExistingImages?.length) {
        formData.append(
          "removedImages",
          JSON.stringify(adData.removedExistingImages)
        );
      }

      // Log FormData contents
      const formDataEntries: Record<string, any> = {};
      formData.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? value.name : value;
      });
      console.log("📤 Final FormData for update:", formDataEntries);

      // ✅ Call update API
      const res = await dispatch(
        UpdatedAd({ id: myAd._id, data: formData }) as any
      ).unwrap();

      if (res.success) {
        router.push("/all-my-ads");
        localStorage.removeItem("myAd");
      }
    } catch (error) {
      setLoading(true);
      console.error("Error updating service ad:", error);
      toast.error("Failed to update service ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Explore</div>
              <div className="text-xs text-muted-foreground">
                Places and activities to discover in Kuwait.
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Place Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="place-name" className="text-sm font-medium">
                Name
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="place-name"
                  placeholder="Enter your Place Name"
                  value={values.exploreName}
                  onChange={(e) =>
                    setField("exploreName", e.target.value.slice(0, nameLimit))
                  }
                  className="rounded-full"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {values.exploreName.length}/{nameLimit}
                </span>
              </div>
              {!isNameValid && values.exploreName.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {values.exploreName.trim().length === 0
                    ? "Name is required"
                    : `Name must be ${nameLimit} characters or less`}
                </div>
              )}
            </div>

            {/* exploreDescription Field */}
            <div className="space-y-2">
              <Label
                htmlFor="place-exploreDescription"
                className="text-sm font-medium"
              >
                Description
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="place-exploreDescription"
                  rows={5}
                  placeholder="Enter the description of your place or activity"
                  value={values.exploreDescription}
                  onChange={(e) =>
                    setField(
                      "exploreDescription",
                      e.target.value.slice(0, descLimit)
                    )
                  }
                  className={cn(
                    !isexploreDescriptionValid &&
                      values.exploreDescription.length > 0 &&
                      "border-destructive"
                  )}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {values.exploreDescription.length}/{descLimit}
                </div>
              </div>
              {!isexploreDescriptionValid &&
                values.exploreDescription.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {values.exploreDescription.trim().length === 0
                      ? "Description is required"
                      : `Description must be ${descLimit} characters or less`}
                  </div>
                )}
            </div>

            {/* Timings Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Timings
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className={cn(
                      "pl-10 w-40 rounded-full",
                      timeError && "border-destructive"
                    )}
                    value={values.startTime}
                    onChange={(e) => setField("startTime", e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className={cn(
                      "pl-10 w-40 rounded-full",
                      timeError && "border-destructive"
                    )}
                    value={values.endTime}
                    onChange={(e) => setField("endTime", e.target.value)}
                  />
                </div>
              </div>
              {timeError && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {timeError}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!isFormValid || loading}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]",
                  (!isFormValid || loading) && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleUpdate}
              >
                {loading ? "Updating..." : "Update Explore"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
