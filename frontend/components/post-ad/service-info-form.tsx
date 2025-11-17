// components/forms/ServiceInfoForm.tsx
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
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import type { ServiceAdData } from "@/types/ad";
import { Input } from "../common/input";
import { categoryOptions, serviceTypeOptions } from "@/lib/data";

export function ServiceInfoForm({
  onChangeType,
}: {
  onChangeType: () => void;
}) {
  const dispatch = useDispatch();
  const adData = useSelector(
    (state: RootState) => state.ad.adData
  ) as ServiceAdData;
  const router = useRouter();

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
                  value={adData.servicePrice ?? ""}
                  onChange={(e) =>
                    handleNumberChange("servicePrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
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
