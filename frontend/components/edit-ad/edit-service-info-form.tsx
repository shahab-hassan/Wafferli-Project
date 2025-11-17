"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils";
import { Wrench, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { setAdData, UpdatedAd } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import type { ServiceAdData } from "@/types/ad";
import { Input } from "../common/input";
import { toast } from "react-hot-toast";

export function EditServiceInfoForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { Ad, adData } = useSelector((state: any) => state.ad);

  const myAd = React.useMemo(() => {
    const adLocalStorage = localStorage.getItem("myAd");
    const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;

    return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
  }, [Ad]); // only re-run when Redux 'Ad' changes

  console.log(myAd, "✅ myAd (final usable data)");

  // Initialize form with myAd data when component mounts
  React.useEffect(() => {
    if (myAd) {
      // Populate adData with myAd values
      dispatch(
        setAdData({
          ...adData,
          category: myAd.category || "",
          subCategory: myAd.subCategory || "",
          serviceType: myAd.serviceType || "",
          servicePrice: myAd.servicePrice || 0,
        })
      );
    }
  }, [myAd, dispatch]);

  // Type-safe setField function
  const setField = <K extends keyof ServiceAdData>(
    key: K,
    value: ServiceAdData[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (field: keyof ServiceAdData, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setField(field, numValue as any);
  };

  // Category and subcategory options
  const categoryOptions = {
    "home-services": {
      label: "Home Services",
      subcategories: [
        { value: "cleaning", label: "Cleaning" },
        { value: "plumbing", label: "Plumbing" },
        { value: "electrical", label: "Electrical" },
        { value: "painting", label: "Painting" },
        { value: "carpentry", label: "Carpentry" },
      ],
    },
    auto: {
      label: "Automotive",
      subcategories: [
        { value: "car-repair", label: "Car Repair" },
        { value: "car-wash", label: "Car Wash" },
        { value: "tire-service", label: "Tire Service" },
        { value: "oil-change", label: "Oil Change" },
      ],
    },
    wellness: {
      label: "Wellness",
      subcategories: [
        { value: "massage", label: "Massage" },
        { value: "yoga", label: "Yoga" },
        { value: "fitness-training", label: "Fitness Training" },
        { value: "nutrition", label: "Nutrition" },
      ],
    },
    professional: {
      label: "Professional Services",
      subcategories: [
        { value: "tutoring", label: "Tutoring" },
        { value: "graphic-design", label: "Graphic Design" },
        { value: "web-development", label: "Web Development" },
        { value: "consulting", label: "Consulting" },
      ],
    },
  };

  // Service type options
  const serviceTypeOptions = [
    { value: "consultation", label: "Consultation" },
    { value: "repair", label: "Repair" },
    { value: "installation", label: "Installation" },
    { value: "cleaning", label: "Cleaning" },
    { value: "beauty", label: "Beauty" },
    { value: "fitness", label: "Fitness" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
    { value: "transport", label: "Transport" },
    { value: "event", label: "Event" },
    { value: "legal", label: "Legal" },
    { value: "financial", label: "Financial" },
  ];

  // Get current subcategories based on selected category
  const currentSubcategories = adData?.category
    ? categoryOptions[adData.category as keyof typeof categoryOptions]
        ?.subcategories || []
    : [];

  // Validation
  const categoryValid = !!adData?.category?.trim();
  const subcategoryValid = !!adData?.subCategory?.trim();
  const serviceTypeValid = !!adData?.serviceType?.trim();
  const priceValid =
    adData?.servicePrice !== undefined && adData.servicePrice > 0;

  const valid =
    categoryValid && subcategoryValid && serviceTypeValid && priceValid;

  const [loading, setLoading] = React.useState(false);
  const handleUpdate = async () => {
    console.log("Updating service data:", adData);

    // Validation code...

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
      formData.append("paymentMode", adData.paymentMode || "monthly");

      // Append service-specific fields
      formData.append("category", adData.category);
      formData.append("subCategory", adData.subCategory);
      formData.append("serviceType", adData.serviceType);
      formData.append("servicePrice", String(adData.servicePrice));

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
        localStorage.getItem("myAd");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating service ad:", error);
      toast.error("Failed to update service ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Type summary */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Service</div>
              <div className="text-xs text-muted-foreground">
                Any service you are offering.
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Service Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Service Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Category */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Category
                {!categoryValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Select
                value={adData?.category || ""}
                onValueChange={(value: string) => {
                  setField("category", value);
                  setField("subCategory", ""); // Reset subcategory when category changes
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent align="end">
                  {Object.entries(categoryOptions).map(([value, option]) => (
                    <SelectItem key={value} value={value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!categoryValid && adData?.category === "" && (
              <p className="text-xs text-destructive text-right">
                Please select a category
              </p>
            )}

            {/* Subcategory */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Subcategory
                {!subcategoryValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Select
                value={adData?.subCategory || ""}
                onValueChange={(value: string) =>
                  setField("subCategory", value)
                }
                disabled={!adData?.category}
              >
                <SelectTrigger className="w-64">
                  <SelectValue
                    placeholder={
                      !adData?.category
                        ? "Select category first"
                        : "Choose a subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent align="end">
                  {currentSubcategories.map((subcategory) => (
                    <SelectItem
                      key={subcategory.value}
                      value={subcategory.value}
                    >
                      {subcategory.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!subcategoryValid && adData?.category && (
              <p className="text-xs text-destructive text-right">
                Please select a subcategory
              </p>
            )}

            {/* Service Type */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Service Type
                {!serviceTypeValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Select
                value={adData?.serviceType || ""}
                onValueChange={(value: string) =>
                  setField("serviceType", value)
                }
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose service type" />
                </SelectTrigger>
                <SelectContent align="end">
                  {serviceTypeOptions.map((serviceType) => (
                    <SelectItem
                      key={serviceType.value}
                      value={serviceType.value}
                    >
                      {serviceType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!serviceTypeValid && adData?.serviceType === "" && (
              <p className="text-xs text-destructive text-right">
                Please select a service type
              </p>
            )}

            {/* Service Price */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">
                  Service Price
                  {!priceValid && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Estimated price for your service.
                </p>
              </div>
              <div className="relative w-64">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  KWD
                </span>
                <Input
                  className="pl-12"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={adData?.servicePrice || ""}
                  onChange={(e) =>
                    handleNumberChange("servicePrice", e.target.value)
                  }
                />
              </div>
            </div>

            {!priceValid && (
              <p className="text-xs text-destructive text-right">
                Please enter a valid service price
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]",
                  !valid && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleUpdate}
              >
                {loading ? "Updating" : "Update Service"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
