"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { cn } from "@/lib/utils";
import { MapPin, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import type { ExploreAdData } from "@/types/ad";

export function ExploreInfoForm({
  onChangeType,
}: {
  onChangeType: () => void;
}) {
  const dispatch = useDispatch();
  const adData = useSelector(
    (state: RootState) => state.ad.adData
  ) as ExploreAdData;
  const router = useRouter();

  // Type-safe setField function
  const setField = async <K extends keyof ExploreAdData>(
    key: K,
    value: ExploreAdData[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  const nameLimit = 70;
  const descLimit = 1000;

  // Type-safe validation with optional chaining
  const nameValid =
    adData?.exploreName?.trim()?.length > 0 &&
    adData?.exploreName?.length <= nameLimit;

  const descValid =
    adData?.exploreDescription?.trim()?.length > 0 &&
    adData?.exploreDescription?.length <= descLimit;

  const convertTo12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getTimeIn24Hour = (time12: string): string => {
    if (!time12) return "";
    const [time, period] = time12.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hours24 = hours;
    if (period === "PM" && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hours24 = 0;
    }

    return `${hours24.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeChange = (field: "startTime" | "endTime", time24: string) => {
    if (time24 && /^\d{2}:\d{2}$/.test(time24)) {
      const time12 = convertTo12Hour(time24);
      setField(field, time12);
    } else {
      setField(field, time24);
    }
  };

  const startTime24 = adData?.startTime
    ? getTimeIn24Hour(adData.startTime)
    : "";
  const endTime24 = adData?.endTime ? getTimeIn24Hour(adData.endTime) : "";

  const timeValid =
    adData?.startTime &&
    adData?.endTime &&
    /^\d{1,2}:\d{2} (AM|PM)$/.test(adData.startTime) &&
    /^\d{1,2}:\d{2} (AM|PM)$/.test(adData.endTime) &&
    startTime24 < endTime24;

  const valid = nameValid && descValid && timeValid;

  // Initialize FeaturesAmenities if undefined
  React.useEffect(() => {
    if (!adData?.FeaturesAmenities) {
      setField("FeaturesAmenities", []);
    }
  }, [adData?.FeaturesAmenities]);

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
                Name<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="place-name"
                  placeholder="Enter place name"
                  value={adData?.exploreName || ""}
                  onChange={(e) =>
                    setField("exploreName", e.target.value.slice(0, nameLimit))
                  }
                  className="rounded-full"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {adData?.exploreName?.length || 0}/{nameLimit}
                </span>
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="place-description"
                className="text-sm font-medium"
              >
                Description<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="place-description"
                  rows={5}
                  placeholder="Describe the place or activity"
                  value={adData?.exploreDescription || ""}
                  onChange={(e) =>
                    setField(
                      "exploreDescription",
                      e.target.value.slice(0, descLimit)
                    )
                  }
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {adData?.exploreDescription?.length || 0}/{descLimit}
                </div>
              </div>
            </div>

            {/* Timings Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Timings<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 w-40 rounded-full"
                      value={startTime24}
                      onChange={(e) =>
                        handleTimeChange("startTime", e.target.value)
                      }
                    />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 w-40 rounded-full"
                      value={endTime24}
                      onChange={(e) =>
                        handleTimeChange("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                {(adData?.startTime || adData?.endTime) && (
                  <div className="text-xs text-muted-foreground">
                    Selected: {adData?.startTime} to {adData?.endTime}
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">
                Features & Amenities
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Wi-Fi",
                  "Parking",
                  "Air Conditioning",
                  "Washroom",
                  "Play Area",
                  "Food Court",
                  "Outdoor Seating",
                  "Pet Friendly",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        adData?.FeaturesAmenities?.includes(item) || false
                      }
                      onChange={() => {
                        const current = [...(adData?.FeaturesAmenities || [])];
                        let updated: string[];
                        if (current?.includes(item)) {
                          updated = current.filter((a) => a !== item);
                        } else {
                          updated = [...current, item];
                        }
                        setField("FeaturesAmenities", updated);
                      }}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div> */}

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]"
                )}
                onClick={() => router.push("/post-ad/billing")}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
