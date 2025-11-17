"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/common/shadecn-card";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Label } from "@/components/common/label";
import { Switch } from "@/components/common/switch";
import { Button } from "@/components/common/button";
import { ChevronRight } from "lucide-react";
import { TypeSelector } from "./type-selector";
import { ImageUploadGrid } from "./image-upload-grid";
import { LocationFields } from "./location-field";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";

export function PostAdForm() {
  const dispatch = useDispatch();
  const adData = useSelector((state: RootState) => state.ad.adData);
  const router = useRouter();

  const setField = <K extends keyof typeof adData>(
    key: K,
    value: (typeof adData)[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  const titleLimit = 100;
  const descLimit = 1000;

  // Image validation - at least 1 image required
  const imagesValid =
    Array.isArray(adData?.images) && adData?.images?.length > 0;

  const locationValid =
    adData?.locationSameAsProfile || (!!adData?.city && !!adData.neighbourhood);

  const phoneValid = /^\+?\d{10,15}$/.test(adData?.phone || "");

  const valid =
    !!adData?.type &&
    adData?.title?.trim()?.length > 0 &&
    adData?.title?.length <= titleLimit &&
    adData?.description?.trim()?.length > 0 &&
    adData?.description?.length <= descLimit &&
    imagesValid && // ✅ Image validation added
    locationValid &&
    phoneValid;

  const disabled = !adData?.type;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Choose Type</h2>
        <TypeSelector
          value={adData?.type}
          onChange={(v) => setField("type", v)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">General Information</h2>
        <Card
          aria-disabled={disabled}
          data-disabled={disabled}
          className={cn(
            "rounded-2xl border bg-card p-4 sm:p-6 transition",
            disabled && "bg-muted/50 opacity-60 pointer-events-none select-none"
          )}
        >
          <fieldset disabled={disabled} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Upload Images<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <ImageUploadGrid
                files={adData?.images || []}
                onChange={(files) => setField("images", files)}
                max={5}
              />
              {!imagesValid && (
                <p className="text-xs text-destructive">
                  At least one image is required
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="Enter title"
                  value={adData?.title || ""}
                  onChange={(e) =>
                    setField("title", e.target.value.slice(0, titleLimit))
                  }
                  className="rounded-full"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {adData?.title?.length || 0}/{titleLimit}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe the item in detail"
                  value={adData?.description || ""}
                  onChange={(e) =>
                    setField("description", e.target.value.slice(0, descLimit))
                  }
                  className="resize-y"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {adData?.description?.length || 0}/{descLimit}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-xs text-muted-foreground">
                  Same as Store/Individual Location
                </p>
              </div>
              <Switch
                checked={adData?.locationSameAsProfile || false}
                onCheckedChange={(v) => {
                  dispatch(
                    setAdData({
                      locationSameAsProfile: v,
                      city: v ? undefined : adData?.city,
                      neighborhood: v ? undefined : adData?.neighbourhood,
                    })
                  );
                }}
                aria-label="Use profile location"
              />
            </div>

            {!adData?.locationSameAsProfile && (
              <LocationFields
                value={{
                  city: adData?.city || "",
                  neighborhood: adData?.neighbourhood || "",
                }}
                onChange={(next) =>
                  dispatch(
                    setAdData({
                      city: next.city,
                      neighbourhood: next.neighborhood,
                    })
                  )
                }
                className="mt-2"
              />
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">Your Phone Number</Label>
                <Input
                  value={adData?.phone || ""}
                  placeholder="+1234567890"
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-44"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Show my phone number in ad</span>
                <Switch
                  checked={adData?.showPhone || false}
                  onCheckedChange={(v) => setField("showPhone", v)}
                  aria-label="Show phone number"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className="rounded-full px-6 transition-transform hover:translate-y-[-1px]"
                onClick={() => {
                  if (adData?.type) {
                    router.push(`/post-ad/${adData.type}?type=${adData.type}`);
                  }
                }}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </fieldset>
        </Card>
      </section>
    </div>
  );
}
