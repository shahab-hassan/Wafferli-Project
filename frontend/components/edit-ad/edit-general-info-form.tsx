"use client";

import * as React from "react";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Switch } from "@/components/common/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Button } from "@/components/common/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypeSelector } from "@/components/post-ad/type-selector";
import { ImageUploadGrid } from "@/components/post-ad/image-upload-grid";
import { LocationFields } from "@/components/post-ad/location-field";
import type { PostType } from "@/types/post-ad";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setAdData } from "@/features/slicer/AdSlice";

type GeneralValues = {
  type: PostType | null;
  images: File[];
  title: string;
  description: string;
  locationSameAsProfile: boolean;
  phone: string;
  showPhoneInAd: boolean;
  sellerKind: "store" | "individual";
  city?: string;
  neighborhood?: string;
  removedExistingImages?: number[]; // ✅ NEW: Track removed existing images
};

export function EditGeneralInfoForm({
  initialType = null,
}: {
  initialType?: PostType | null;
}) {
  const dispatch = useDispatch();
  const { Ad } = useSelector((state: any) => state.ad);
  const myAd = React.useMemo(() => {
    const adLocalStorage = localStorage.getItem("myAd");
    const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;

    return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
  }, [Ad]); // only re-run when Redux 'Ad' changes
  console.log(Ad, "myadsdss");

  const router = useRouter();

  // Initialize form with myAd data
  const [values, setValues] = React.useState<GeneralValues>({
    type: myAd?.adType || initialType,
    images: [],
    title: myAd?.title || "",
    description: myAd?.description || "",
    locationSameAsProfile: myAd?.locationSameAsProfile || true,
    phone: myAd?.phone || "",
    showPhoneInAd: myAd?.showPhone !== false,
    sellerKind: "individual",
    city: myAd?.city || "",
    neighborhood: myAd?.neighbourhood || "",
    removedExistingImages: [], // ✅ NEW: Initialize empty array
  });

  // Update form when myAd data changes
  React.useEffect(() => {
    if (myAd) {
      setValues({
        type: myAd.adType || initialType,
        images: [],
        title: myAd.title || "",
        description: myAd.description || "",
        locationSameAsProfile: myAd.locationSameAsProfile !== false,
        phone: myAd.phone || "",
        showPhoneInAd: myAd.showPhone !== false,
        sellerKind: "individual",
        city: myAd.city || "",
        neighborhood: myAd.neighbourhood || "",
        removedExistingImages: [], // ✅ NEW: Reset when myAd changes
      });
    }
  }, [myAd, initialType]);

  const setField = <K extends keyof GeneralValues>(
    key: K,
    value: GeneralValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ NEW: Handle removing existing images
  const handleRemoveExistingImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      removedExistingImages: [...(prev.removedExistingImages || []), index],
    }));
  };

  // ✅ NEW: Get filtered existing images (excluding removed ones)
  const getFilteredExistingImages = () => {
    if (!myAd?.images) return [];
    return myAd.images.filter(
      (_, index) => !values.removedExistingImages?.includes(index)
    );
  };

  // Validation constants
  const titleLimit = 70;
  const descLimit = 4096;

  // Validation functions - updated to include existing images
  const existingImages = getFilteredExistingImages();
  const imagesValid = existingImages.length > 0 || values.images.length > 0;

  const locationValid =
    values.locationSameAsProfile || (!!values.city && !!values.neighborhood);

  const phoneValid = /^\+?\d{10,15}$/.test(values.phone);

  const valid =
    !!values.type &&
    values.title.trim().length > 0 &&
    values.title.length <= titleLimit &&
    values.description.trim().length > 0 &&
    values.description.length <= descLimit &&
    imagesValid &&
    locationValid &&
    phoneValid;

  // Handle continue to next step
  // Handle continue to next step
  const handleContinue = () => {
    if (!values.type || !myAd?._id) return;

    // Dispatch the updated data to Redux
    dispatch(
      setAdData({
        ...myAd,
        type: values.type,
        title: values.title,
        description: values.description,
        locationSameAsProfile: values.locationSameAsProfile,
        phone: values.phone,
        showPhone: values.showPhoneInAd,
        city: values.city,
        neighbourhood: values.neighborhood,
        // ✅ Send removed images and new images separately
        removedExistingImages: values.removedExistingImages,
        newImages: values.images, // This should be the new uploaded files
      })
    );

    router.push(`/edit-ad/${values.type}`);
  };

  return (
    <div className="space-y-6">
      {/* Choose Type */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Choose Type</h2>
        <TypeSelector selectedType={values.type} />
      </section>

      {/* General Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">General Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Upload - Updated with existing images */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Images</Label>
              <ImageUploadGrid
                files={values.images}
                onChange={(files) => setField("images", files)}
                max={5}
                existingImages={existingImages} // ✅ Pass existing images
                onRemoveExisting={handleRemoveExistingImage} // ✅ Pass remove handler
              />
              {!imagesValid && (
                <p className="text-xs text-destructive">
                  At least one image is required
                </p>
              )}
            </div>

            {/* Rest of the form remains the same */}
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
                {values.title.trim() ? null : (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={values.title}
                  onChange={(e) =>
                    setField("title", e.target.value.slice(0, titleLimit))
                  }
                  className="rounded-full"
                  placeholder="Enter ad title"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {values.title.length}/{titleLimit}
                </span>
              </div>
              {!values.title.trim() && (
                <p className="text-xs text-destructive">Title is required</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
                {values.description.trim() ? null : (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  rows={5}
                  value={values.description}
                  onChange={(e) =>
                    setField("description", e.target.value.slice(0, descLimit))
                  }
                  placeholder="Describe your ad in detail"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {values.description.length}/{descLimit}
                </div>
              </div>
              {!values.description.trim() && (
                <p className="text-xs text-destructive">
                  Description is required
                </p>
              )}
            </div>

            {/* Location toggle */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">
                  Location
                  {locationValid ? null : (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Same as Store/Individual Location
                </p>
              </div>
              <Switch
                checked={values.locationSameAsProfile}
                onCheckedChange={(v) => {
                  setValues((p) => ({
                    ...p,
                    locationSameAsProfile: v,
                    city: v ? "" : p.city,
                    neighborhood: v ? "" : p.neighborhood,
                  }));
                }}
                aria-label="Use profile location"
              />
            </div>

            {!values.locationSameAsProfile && (
              <LocationFields
                value={{ city: values.city, neighborhood: values.neighborhood }}
                onChange={(next) =>
                  setValues((p) => ({
                    ...p,
                    city: next.city,
                    neighborhood: next.neighborhood,
                  }))
                }
              />
            )}

            {!locationValid && !values.locationSameAsProfile && (
              <p className="text-xs text-destructive">
                Please select both city and neighborhood
              </p>
            )}

            {/* Phone */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Your Phone Number
                {phoneValid ? null : (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Input
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="w-44"
                placeholder="+965 123456"
              />
            </div>
            {!phoneValid && values.phone && (
              <p className="text-xs text-destructive text-right">
                Please enter a valid phone number
              </p>
            )}

            {/* Phone visibility */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm">Show my phone number in ad</span>
              <Switch
                checked={values.showPhoneInAd}
                onCheckedChange={(v) => setField("showPhoneInAd", v)}
                aria-label="Show phone number"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]",
                  !valid && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleContinue}
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
