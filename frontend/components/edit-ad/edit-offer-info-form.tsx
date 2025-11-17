"use client";

import * as React from "react";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Button } from "@/components/common/button";
import { Switch } from "@/components/common/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { Calendar } from "@/components/common/calender";
import { cn } from "@/lib/utils";
import { ChevronRight, CalendarIcon, Tag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store/store";
import { OfferAdData } from "@/types/ad";
import { setAdData, UpdatedAd } from "@/features/slicer/AdSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { offerCategories } from "@/lib/data";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Values = {
  flashDeal: boolean;
  expiry?: Date;
  discountDeal: boolean;
  fullPrice?: string;
  discountPercent?: string;
  offerDetail?: string;
};

function formatDDMMYYYY(d?: string | Date): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function EditOfferInfoForm({
  onChangeType,
  onContinue,
}: {
  onChangeType: () => void;
  onContinue?: (values: Values) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const adData = useSelector(
    (state: RootState) => state.ad.adData as OfferAdData
  );

  // Get ad data from Redux or localStorage
  const myAd = React.useMemo(() => {
    try {
      const adLocalStorage =
        typeof window !== "undefined" ? localStorage.getItem("myAd") : null;
      return adLocalStorage ? JSON.parse(adLocalStorage) : null;
    } catch (error) {
      console.error("Error parsing ad data:", error);
      return null;
    }
  }, []);

  const setField = <K extends keyof OfferAdData>(k: K, v: OfferAdData[K]) => {
    dispatch(setAdData({ [k]: v }));
  };

  // Initialize default expiryDate for flashDeal
  React.useEffect(() => {
    if (adData?.flashDeal && !adData?.expiryDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setField("expiryDate", tomorrow.toISOString());
    }
  }, [adData?.flashDeal, adData?.expiryDate]);

  // Initialize form with existing data
  React.useEffect(() => {
    if (myAd) {
      // Set offer specific fields from myAd
      if (myAd.flashDeal !== undefined) setField("flashDeal", myAd.flashDeal);
      if (myAd.expiryDate) setField("expiryDate", myAd.expiryDate);
      if (myAd.discountDeal !== undefined)
        setField("discountDeal", myAd.discountDeal);
      if (myAd.fullPrice !== undefined) setField("fullPrice", myAd.fullPrice);
      if (myAd.discountPercent !== undefined)
        setField("discountPercent", myAd.discountPercent);
      if (myAd.offerDetail) setField("offerDetail", myAd.offerDetail);
      if (myAd.category) setField("category", myAd.category);
    }
  }, [myAd]);

  // Validation functions
  const fullPriceValid =
    !adData?.discountDeal ||
    (adData?.fullPrice !== null &&
      adData?.fullPrice !== undefined &&
      !isNaN(Number(adData?.fullPrice)) &&
      Number(adData?.fullPrice) > 0);

  const discountPercentValid =
    !adData?.discountDeal ||
    (adData?.discountPercent !== null &&
      adData?.discountPercent !== undefined &&
      !isNaN(Number(adData?.discountPercent)) &&
      adData?.discountPercent >= 0 &&
      adData?.discountPercent <= 100);

  const offerDetailValid =
    !adData?.discountDeal ||
    (adData?.offerDetail?.trim().length > 0 &&
      adData?.offerDetail?.length <= 70);

  const expiryValid =
    adData?.expiryDate &&
    !isNaN(new Date(adData?.expiryDate).getTime()) &&
    new Date(adData?.expiryDate) > new Date();

  const categoryValid = !!adData?.category?.trim();

  const isFormValid = fullPriceValid && expiryValid && categoryValid;

  const handleUpdate = async () => {
    if (!isFormValid || !myAd?._id) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Helper function to append values to formData
      const appendIfValid = (key: string, value: any) => {
        if (value !== null && value !== undefined && value !== "") {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, String(value));
          }
        }
      };

      // Append basic ad data from myAd
      formData.append("adType", myAd.adType || "offer");
      formData.append("title", myAd.title || "");
      formData.append("description", myAd.description || "");
      formData.append(
        "locationSameAsProfile",
        String(myAd.locationSameAsProfile || true)
      );
      formData.append("city", myAd.city || "");
      formData.append("neighbourhood", myAd.neighbourhood || "");
      formData.append("phone", myAd.phone || "");
      formData.append("showPhone", String(myAd.showPhone !== false));

      // Validate and append offer specific data
      if (
        !adData?.expiryDate ||
        isNaN(new Date(adData.expiryDate).getTime()) ||
        new Date(adData.expiryDate) <= new Date()
      ) {
        toast.error("Expiry date must be a valid future date");
        return;
      }

      if (!adData?.category?.trim()) {
        toast.error("Category is required");
        return;
      }

      if (
        adData?.discountDeal &&
        (!adData.fullPrice || adData.fullPrice <= 0)
      ) {
        toast.error("Full price must be a positive number for discount deals");
        return;
      }

      // Append offer specific fields
      appendIfValid("expiryDate", adData?.expiryDate);
      appendIfValid("flashDeal", adData?.flashDeal);
      appendIfValid("discountDeal", adData?.discountDeal);
      appendIfValid("category", adData?.category);
      appendIfValid("fullPrice", adData?.fullPrice);

      if (adData?.discountDeal) {
        if (
          adData.discountPercent === null ||
          adData.discountPercent === undefined ||
          adData.discountPercent < 0 ||
          adData.discountPercent > 100
        ) {
          toast.error("Discount percent must be between 0 and 100");
          return;
        }
        appendIfValid("discountPercent", adData.discountPercent);
      } else {
        if (!adData?.offerDetail?.trim() || adData.offerDetail.length > 70) {
          toast.error("Offer detail must be 1-70 characters");
          return;
        }
        appendIfValid("offerDetail", adData.offerDetail);
      }

      // Append new images as files
      if (myAd.newImages?.length) {
        myAd.newImages.forEach((image: any, index: number) => {
          if (image instanceof File && image.size > 0) {
            formData.append("images", image);
          }
        });
      }

      // Send removed images indices
      if (myAd.removedExistingImages?.length) {
        formData.append(
          "removedImages",
          JSON.stringify(myAd.removedExistingImages)
        );
      }

      // Log FormData contents for debugging
      console.log("📤 FormData being sent for offer update:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      });

      // Call update API
      const res = await dispatch(
        UpdatedAd({ id: myAd._id, data: formData }) as any
      ).unwrap();

      if (res.success) {
        localStorage.removeItem("myAd");
        router.push("/all-my-ads");
      } else {
        toast.error(res.message || "Failed to update offer");
      }
    } catch (error: any) {
      console.error("Error updating offer:", error);
      toast.error(error?.message || "Failed to update offer");
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
              <Tag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Offer</div>
              <div className="text-xs text-muted-foreground">
                Exclusive deal, flash deal, or package.
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Offer Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Flash Deal</Label>
                <p className="text-xs text-muted-foreground">
                  Flash Deals are exclusive deals that expire within 24h.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={adData?.flashDeal || false}
                  onCheckedChange={(v) => setField("flashDeal", v)}
                  aria-label="Flash deal"
                />
                <span className="text-sm text-muted-foreground">
                  {adData?.flashDeal ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Expiry Date
                  {!adData?.expiryDate && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </Label>
                <div className="relative w-64">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-full border bg-background px-10 py-2.5 text-left text-sm",
                          !adData?.expiryDate && "text-muted-foreground"
                        )}
                      >
                        {formatDDMMYYYY(adData?.expiryDate) || "dd-mm-yyyy"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          adData?.expiryDate
                            ? new Date(adData?.expiryDate)
                            : undefined
                        }
                        onSelect={(d) => {
                          if (d) setField("expiryDate", d.toISOString());
                          setOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date <= new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              {!expiryValid && (
                <p className="text-xs text-destructive">
                  Expiry date must be a valid future date
                </p>
              )}
            </div>

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
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent align="end">
                  {offerCategories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">Discount Deal</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={adData?.discountDeal || false}
                  onCheckedChange={(v) => {
                    setField("discountDeal", v);
                    if (v) {
                      setField("offerDetail", "");
                      setField("fullPrice", 0);
                      setField("discountPercent", 0);
                    } else {
                      setField("fullPrice", null);
                      setField("discountPercent", null);
                      setField("offerDetail", "");
                    }
                  }}
                  aria-label="Discount deal"
                />
                <span className="text-sm text-muted-foreground">
                  {adData?.discountDeal ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Full Price
                  {!fullPriceValid && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </Label>
                <div className="relative w-64">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    KWD
                  </span>
                  <Input
                    className="pl-12 rounded-full"
                    inputMode="decimal"
                    placeholder="Enter price before discount"
                    value={adData?.fullPrice ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setField("fullPrice", value ? Number(value) : null);
                    }}
                  />
                </div>
              </div>
              {!fullPriceValid && adData?.fullPrice !== null && (
                <p className="text-xs text-destructive">
                  Full price must be a positive number
                </p>
              )}
            </div>

            {adData?.discountDeal ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium">
                    Discount Percent
                    {!discountPercentValid && (
                      <span className="ml-0.5 text-destructive">*</span>
                    )}
                  </Label>
                  <div className="relative w-64">
                    <Input
                      className="pr-8 rounded-full"
                      inputMode="decimal"
                      placeholder="Enter discount"
                      value={adData?.discountPercent ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers and dot (for decimals)
                        if (/^\d*\.?\d*$/.test(value)) {
                          setField(
                            "discountPercent",
                            value === "" ? null : Number(value)
                          );
                        }
                      }}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
                {!discountPercentValid && adData?.discountPercent !== null && (
                  <p className="text-xs text-destructive">
                    Discount percent must be between 0 and 100
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium">
                    Offer Detail
                    {!offerDetailValid && (
                      <span className="ml-0.5 text-destructive">*</span>
                    )}
                  </Label>
                  <div className="w-64">
                    <Textarea
                      rows={2}
                      maxLength={70}
                      placeholder="Describe the offer, e.g., Buy 1 Get 1 Free"
                      value={adData?.offerDetail || ""}
                      onChange={(e) => setField("offerDetail", e.target.value)}
                    />
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {adData?.offerDetail?.length || 0}/70
                    </div>
                  </div>
                </div>
                {!offerDetailValid && adData?.offerDetail && (
                  <p className="text-xs text-destructive">
                    Offer detail must be 1-70 characters
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!isFormValid || loading}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleUpdate}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update Offer
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
