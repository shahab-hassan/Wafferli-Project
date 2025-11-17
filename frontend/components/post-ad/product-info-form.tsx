"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";
import { Button } from "@/components/common/button";
import { Switch } from "@/components/common/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import { productCategoryOptions } from "@/lib/data";
import { ProductAdData } from "@/types/ad";
export function ProductInfoForm({
  typeLabel,
  onChangeType,
}: {
  typeLabel: string;
  onChangeType: () => void;
}) {
  const dispatch = useDispatch();
  const adData = useSelector(
    (state: RootState) => state.ad.adData
  ) as ProductAdData;
  const router = useRouter();

  // Type-safe setField function
  const setField = <K extends keyof ProductAdData>(
    key: K,
    value: ProductAdData[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  // Category and subcategory options

  // Get current subcategories based on selected category
  const currentSubcategories = adData.category
    ? productCategoryOptions[
        adData.category as keyof typeof productCategoryOptions
      ]?.subcategories || []
    : [];

  // Validation
  const priceValid =
    adData.askingPrice !== null &&
    adData.askingPrice !== undefined &&
    Number(adData.askingPrice) >= 0;

  const quantityValid =
    !adData.recurring ||
    (adData.quantity !== null &&
      adData.quantity !== undefined &&
      Number(adData.quantity) > 0);

  const categoryValid = !!adData.category?.trim();

  const subcategoryValid = !!adData.subCategory?.trim();

  const discountValid =
    !adData.discount ||
    (adData.discountPercent !== null &&
      adData.discountPercent !== undefined &&
      Number(adData.discountPercent) >= 0 &&
      Number(adData.discountPercent) <= 100);

  const valid =
    priceValid &&
    quantityValid &&
    categoryValid &&
    subcategoryValid &&
    discountValid;

  // Handle number input changes
  const handleNumberChange = (
    field: "quantity" | "askingPrice" | "discountPercent",
    value: string
  ) => {
    const numValue = value === "" ? null : Number(value);
    setField(field, numValue);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="sr-only">{typeLabel}</span>
              <span aria-hidden>🛒</span>
            </span>
            <div>
              <div className="text-sm font-medium">{typeLabel}</div>
              <div className="text-xs text-muted-foreground">
                Anything you want to sell.
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Product Information</h2>
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
                value={adData.category}
                onValueChange={(value: string) => {
                  setField("category", value);
                  setField("subCategory", ""); // Reset subcategory when category changes
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent align="end">
                  {Object.entries(productCategoryOptions).map(
                    ([value, option]) => (
                      <SelectItem key={value} value={value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Subcategory
                {!subcategoryValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Select
                value={adData.subCategory}
                onValueChange={(value: string) =>
                  setField("subCategory", value)
                }
                disabled={!adData.category}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a subcategory" />
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

            {/* Recurring Product */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Stock Product</Label>
                <p className="text-xs text-muted-foreground">
                  Do you have multiple stock of the product
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={adData.recurring}
                  onCheckedChange={(checked: boolean) => {
                    setField("recurring", checked);
                    if (!checked) setField("quantity", null);
                  }}
                  aria-label="Recurring product"
                />
                <span className="text-sm text-muted-foreground">
                  {adData.recurring ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Quantity (only show if recurring) */}
            {adData.recurring && (
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Quantity
                  {adData.recurring &&
                    (!adData.quantity || Number(adData.quantity) <= 0) && (
                      <span className="ml-0.5 text-destructive">*</span>
                    )}
                </Label>
                <Input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="Enter quantity"
                  className="w-64"
                  value={adData.quantity ?? ""}
                  onChange={(e) =>
                    handleNumberChange("quantity", e.target.value)
                  }
                />
              </div>
            )}

            {/* Asking Price */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">
                  Asking Price
                  {!priceValid && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Rough estimate of the price of product.
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
                  value={adData.askingPrice ?? ""}
                  onChange={(e) =>
                    handleNumberChange("askingPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Discount Toggle */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">Discount</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={adData.discount}
                  onCheckedChange={(checked: boolean) => {
                    setField("discount", checked);
                    if (!checked) setField("discountPercent", null);
                  }}
                  aria-label="Enable discount"
                />
                <span className="text-sm text-muted-foreground">
                  {adData.discount ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Discount Percent (only show if discount enabled) */}
            {adData.discount && (
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Discount Percent
                  {adData.discount &&
                    (!adData.discountPercent ||
                      Number(adData.discountPercent) < 0 ||
                      Number(adData.discountPercent) > 100) && (
                      <span className="ml-0.5 text-destructive">*</span>
                    )}
                </Label>
                <div className="relative w-64">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    placeholder="0"
                    value={adData.discountPercent ?? ""}
                    onChange={(e) =>
                      handleNumberChange("discountPercent", e.target.value)
                    }
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="flex items-center justify-end pt-4">
              <Button
                variant="primary"
                disabled={!valid}
                className="rounded-full px-6 transition-transform hover:translate-y-[-1px]"
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
