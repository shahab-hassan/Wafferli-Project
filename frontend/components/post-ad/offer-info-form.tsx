"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Tag, CalendarIcon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import { OfferAdData } from "@/types/ad";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { offerCategories } from "@/lib/data";

function formatDDMMYYYY(d?: string | Date): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function OfferInfoForm({ onChangeType }: { onChangeType: () => void }) {
  const dispatch = useDispatch();
  const adData = useSelector(
    (state: RootState) => state.ad.adData as OfferAdData
  );
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const setField = <K extends keyof OfferAdData>(k: K, v: OfferAdData[K]) => {
    dispatch(setAdData({ [k]: v }));
  };

  const fullPriceValid =
    !adData?.discountDeal ||
    (adData?.fullPrice !== null &&
      !isNaN(Number(adData?.fullPrice)) &&
      Number(adData?.fullPrice) > 0);
  const discountPercentValid =
    !adData?.discountDeal ||
    (adData?.discountPercent !== null &&
      !isNaN(Number(adData?.discountPercent)) &&
      adData?.discountPercent >= 0 &&
      adData?.discountPercent <= 100);
  const offerDetailValid =
    adData?.discountDeal ||
    (adData?.offerDetail?.trim().length > 0 &&
      adData?.offerDetail?.length <= 70);
  const expiryValid =
    adData?.expiryDate &&
    !isNaN(new Date(adData?.expiryDate).getTime()) &&
    new Date(adData?.expiryDate) > new Date();
  const categoryValid = !!adData.category?.trim();

  const valid =
    fullPriceValid && discountPercentValid && offerDetailValid && expiryValid;

  // Initialize default expiryDate for flashDeal
  React.useEffect(() => {
    if (adData?.flashDeal && !adData?.expiryDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setField("expiryDate", tomorrow.toISOString());
    }
  }, [adData?.flashDeal, adData?.expiryDate]);

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
                  checked={adData?.flashDeal}
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
                value={adData.category}
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
                  checked={adData?.discountDeal}
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
              <>
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
                  {!discountPercentValid &&
                    adData?.discountPercent !== null && (
                      <p className="text-xs text-destructive">
                        Discount percent must be between 0 and 100
                      </p>
                    )}
                </div>
              </>
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
                      value={adData?.offerDetail}
                      onChange={(e) => setField("offerDetail", e.target.value)}
                    />
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {adData?.offerDetail?.length}/70
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
