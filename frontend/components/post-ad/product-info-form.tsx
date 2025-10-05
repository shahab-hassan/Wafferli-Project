"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { Switch } from "@/components/common/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type ProductInfoValues = {
  category?: string
  subcategory?: string
  recurring: boolean
  quantity?: string
  price?: string
  discount: boolean
  discountPercent?: string
}

export function ProductInfoForm({
  typeLabel,
  onChangeType,
}: {
  typeLabel: string
  onChangeType: () => void
}) {
  const [values, setValues] = React.useState<ProductInfoValues>({
    recurring: false,
    discount: true,
  })
  const router = useRouter()

  const setField = <K extends keyof ProductInfoValues>(k: K, v: ProductInfoValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }))

  const priceValid = !!values.price && Number(values.price) >= 0
  const quantityValid = !values.recurring || (!!values.quantity && Number(values.quantity) > 0)
  const categoryValid = !!values.category
  const subcategoryValid = !!values.subcategory
  const discountValid = !values.discount || (!!values.discountPercent && Number(values.discountPercent) >= 0)

  const valid = priceValid && quantityValid && categoryValid && subcategoryValid && discountValid

  return (
    <div className="space-y-6">
      {/* Type summary */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="sr-only">{typeLabel}</span>
              {/* Simple icon placeholder */}
              <span aria-hidden>🛒</span>
            </span>
            <div>
              <div className="text-sm font-medium">{typeLabel}</div>
              <div className="text-xs text-muted-foreground">Anything you want to sell.</div>
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
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Category{!values.category ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <Select
                value={values.category}
                onValueChange={(v) => {
                  setField("category", v)
                  setField("subcategory", undefined)
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Subcategory{!values.subcategory ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <Select
                value={values.subcategory}
                onValueChange={(v) => setField("subcategory", v)}
                disabled={!values.category}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a subcategory" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="phones">Phones</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Product */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Recurring Product</Label>
                <p className="text-xs text-muted-foreground">Do you have multiple stock of the product</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.recurring}
                  onCheckedChange={(v) => {
                    setField("recurring", v)
                    if (!v) setField("quantity", undefined)
                  }}
                  aria-label="Recurring product"
                />
                <span className="text-sm text-muted-foreground">{values.recurring ? "Yes" : "No"}</span>
              </div>
            </div>

            {values.recurring && (
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Quantity
                  {!(values.quantity && Number(values.quantity) > 0) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <Input
                  inputMode="numeric"
                  placeholder="Enter quantity of item in stock"
                  className="w-64"
                  value={values.quantity ?? ""}
                  onChange={(e) => setField("quantity", e.target.value)}
                />
              </div>
            )}

            {/* Asking Price */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">
                  Asking Price{!priceValid ? <span className="ml-0.5 text-destructive">*</span> : null}
                </Label>
                <p className="text-xs text-muted-foreground">Rough estimate of the price of product.</p>
              </div>
              <div className="relative w-64">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  KWD
                </span>
                <Input
                  className="pl-12"
                  inputMode="decimal"
                  placeholder="Enter price"
                  value={values.price ?? ""}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">Discount</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.discount}
                  onCheckedChange={(v) => {
                    setField("discount", v)
                    if (!v) setField("discountPercent", undefined)
                  }}
                  aria-label="Enable discount"
                />
                <span className="text-sm text-muted-foreground">{values.discount ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Discount Percent
                {values.discount && !(values.discountPercent && Number(values.discountPercent) >= 0) ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <div className="relative w-64">
                <Input
                  disabled={!values.discount}
                  inputMode="decimal"
                  placeholder="Enter discount"
                  value={values.discountPercent ?? ""}
                  onChange={(e) => setField("discountPercent", e.target.value)}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn("rounded-full px-6 transition-transform hover:translate-y-[-1px]")}
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
  )
}
