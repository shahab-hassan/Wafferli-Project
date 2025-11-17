"use client";

import * as React from "react";
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
import { ProductAdData } from "@/types/ad";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { UpdatedAd } from "@/features/slicer/AdSlice";
import { toast } from "react-hot-toast";

type Values = {
  category?: string;
  subCategory?: string;
  recurring: boolean;
  quantity?: number | null;
  askingPrice?: number | null;
  discount: boolean;
  discountPercent?: number | null;
};

export function EditProductInfoForm() {
  const [values, setValues] = React.useState<Values>({
    recurring: false,
    discount: false,
    quantity: null,
    askingPrice: null,
    discountPercent: null,
    category: "",
    subCategory: "",
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const { Ad } = useSelector((state: any) => state.ad);
  const router = useRouter();

  // Get ad data from Redux or localStorage
  const myAd = React.useMemo(() => {
    try {
      const adLocalStorage =
        typeof window !== "undefined" ? localStorage.getItem("myAd") : null;
      const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;
      return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
    } catch (error) {
      console.error("Error parsing ad data:", error);
      return null;
    }
  }, [Ad]);

  // Initialize form with existing data
  React.useEffect(() => {
    if (myAd) {
      setValues({
        recurring: myAd.recurring || false,
        discount: myAd.discount || false,
        quantity: myAd.quantity || null,
        askingPrice: myAd.askingPrice || null,
        discountPercent: myAd.discountPercent || null,
        category: myAd.category || "",
        subCategory: myAd.subCategory || "",
      });
    }
  }, [myAd]);

  const categoryOptions = {
    electronics: {
      label: "Electronics",
      subcategories: [
        { value: "phones", label: "Phones" },
        { value: "laptops", label: "Laptops" },
        { value: "tablets", label: "Tablets" },
        { value: "accessories", label: "Accessories" },
        { value: "cameras", label: "Cameras" },
      ],
    },
    fashion: {
      label: "Fashion",
      subcategories: [
        { value: "clothing", label: "Clothing" },
        { value: "shoes", label: "Shoes" },
        { value: "accessories", label: "Accessories" },
        { value: "watches", label: "Watches" },
        { value: "jewelry", label: "Jewelry" },
      ],
    },
    home: {
      label: "Home",
      subcategories: [
        { value: "furniture", label: "Furniture" },
        { value: "appliances", label: "Appliances" },
        { value: "decor", label: "Decor" },
        { value: "kitchen", label: "Kitchen" },
        { value: "garden", label: "Garden" },
      ],
    },
    vehicles: {
      label: "Vehicles",
      subcategories: [
        { value: "cars", label: "Cars" },
        { value: "motorcycles", label: "Motorcycles" },
        { value: "bicycles", label: "Bicycles" },
        { value: "parts", label: "Parts & Accessories" },
      ],
    },
  };

  const setField = <K extends keyof Values>(k: K, v: Values[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  const handleNumberInput = (
    value: string,
    field: "quantity" | "askingPrice" | "discountPercent"
  ) => {
    if (value === "") {
      setField(field, null);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setField(field, numValue);
      }
    }
  };

  const getCurrentSubcategories = () => {
    if (!values.category) return [];
    return (
      categoryOptions[values.category as keyof typeof categoryOptions]
        ?.subcategories || []
    );
  };

  const priceValid = !!values.askingPrice && Number(values.askingPrice) >= 0;
  const quantityValid =
    !values.recurring || (!!values.quantity && Number(values.quantity) > 0);
  const categoryValid = !!values.category;
  const subcategoryValid = !!values.subCategory;
  const discountValid =
    !values.discount ||
    (!!values.discountPercent &&
      Number(values.discountPercent) >= 0 &&
      Number(values.discountPercent) <= 100);
  const isFormValid =
    priceValid &&
    quantityValid &&
    categoryValid &&
    subcategoryValid &&
    discountValid;

  const handleUpdate = async () => {
    if (!isFormValid || !myAd?._id) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Append basic ad data from myAd
      formData.append("adType", myAd.adType || "product");
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

      // Append product-specific data from form values
      formData.append("category", values.category || "");
      formData.append("subCategory", values.subCategory || "");
      formData.append("recurring", String(values.recurring));
      formData.append("discount", String(values.discount));

      if (values.askingPrice !== null) {
        formData.append("askingPrice", values.askingPrice.toString());
      }

      if (values.quantity !== null) {
        formData.append("quantity", values.quantity.toString());
      }

      if (values.discountPercent !== null) {
        formData.append("discountPercent", values.discountPercent.toString());
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
      console.log("📤 FormData being sent for product update:");
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
        toast.error(res.message || "Failed to update product");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error?.message || "Failed to update product");
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
              <span aria-hidden>🛒</span>
            </span>
            <div>
              <div className="text-sm font-medium">Product</div>
              <div className="text-xs text-muted-foreground">
                Anything you want to sell.
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Product Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Product Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Category */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Label className="text-sm font-medium sm:w-1/3">
                Category
                {!values.category ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <Select
                value={values.category}
                onValueChange={(v) => {
                  setField("category", v);
                  setField("subCategory", undefined);
                }}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="electronics">
                    Electronics & Technology
                  </SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Label className="text-sm font-medium sm:w-1/3">
                Subcategory
                {!values.subCategory ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <Select
                value={values.subCategory}
                onValueChange={(v) => setField("subCategory", v)}
                disabled={!values.category}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue
                    placeholder={
                      values.category
                        ? "Select subcategory"
                        : "Select category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent align="end">
                  {getCurrentSubcategories().map((subcat) => (
                    <SelectItem key={subcat.value} value={subcat.value}>
                      {subcat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurring */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="sm:w-1/3">
                <Label className="text-sm font-medium">Recurring Product</Label>
                <p className="text-xs text-muted-foreground">
                  Do you have multiple stock of the product
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.recurring}
                  onCheckedChange={(v) => {
                    setField("recurring", v);
                    if (!v) setField("quantity", null);
                  }}
                  aria-label="Recurring product"
                />
                <span className="text-sm text-muted-foreground">
                  {values.recurring ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {values.recurring && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Label className="text-sm font-medium sm:w-1/3">
                  Quantity
                  {!(values.quantity && Number(values.quantity) > 0) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <Input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="5"
                  className="w-full sm:w-64"
                  value={values.quantity ?? ""}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, "quantity")
                  }
                />
              </div>
            )}

            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="sm:w-1/3">
                <Label className="text-sm font-medium">
                  Asking Price
                  {!priceValid ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Rough estimate of the price of product.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  KWD
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-12"
                  inputMode="decimal"
                  placeholder="450"
                  value={values.askingPrice ?? ""}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, "askingPrice")
                  }
                />
              </div>
            </div>

            {/* Discount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Label className="text-sm font-medium sm:w-1/3">Discount</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.discount}
                  onCheckedChange={(v) => {
                    setField("discount", v);
                    if (!v) setField("discountPercent", null);
                  }}
                  aria-label="Enable discount"
                />
                <span className="text-sm text-muted-foreground">
                  {values.discount ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {values.discount && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Label className="text-sm font-medium sm:w-1/3">
                  Discount Percent
                  {values.discount &&
                  !(
                    values.discountPercent &&
                    Number(values.discountPercent) >= 0 &&
                    Number(values.discountPercent) <= 100
                  ) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <div className="relative w-full sm:w-64">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    disabled={!values.discount}
                    inputMode="decimal"
                    placeholder="15"
                    value={values.discountPercent ?? ""}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, "discountPercent")
                    }
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
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
                    Update Product
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
