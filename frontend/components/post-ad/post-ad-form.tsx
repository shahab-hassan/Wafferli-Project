"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Input } from "@/components/common/input"
import { Textarea } from "@/components/common/textarea"
import { Label } from "@/components/common/label"
import { Switch } from "@/components/common/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Button } from "@/components/common/button"
import { ChevronRight } from "lucide-react"
import { TypeSelector } from "./type-selector"
import { ImageUploadGrid } from "./image-upload-grid"
import type { PostAdFormValues, PostType } from "@/types/post-ad"
import { cn } from "@/lib/utils"
import { LocationFields } from "./location-field" // add reusable location selector
import { useRouter } from "next/navigation"

export function PostAdForm() {
  const [values, setValues] = React.useState<PostAdFormValues>({
    type: null,
    images: [],
    title: "",
    description: "",
    locationSameAsProfile: true,
    showPhoneInAd: false,
    phone: "+965 123456",
    sellerKind: "individual",
    city: undefined, // add city
    neighborhood: undefined, // add neighborhood
  })

  const setField = <K extends keyof PostAdFormValues>(key: K, v: PostAdFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }))

  const titleLimit = 70
  const descLimit = 4096
  const locationValid = values.locationSameAsProfile || (!!values.city && !!values.neighborhood)

  const valid =
    !!values.type &&
    values.title.trim().length > 0 &&
    values.title.length <= titleLimit &&
    values.description.trim().length > 0 &&
    values.description.length <= descLimit &&
    locationValid

  const disabled = !values.type

  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Choose Type */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Choose Type</h2>
        <TypeSelector value={values.type} onChange={(v: PostType) => setField("type", v)} />
      </section>

      {/* General Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">General Information</h2>
        <Card
          aria-disabled={disabled}
          data-disabled={disabled}
          className={cn(
            "rounded-2xl border bg-card p-4 sm:p-6 transition",
            disabled && "bg-muted/50 opacity-60 pointer-events-none select-none",
          )}
        >
          <fieldset disabled={disabled} className="grid grid-cols-1 gap-6">
            {/* Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Images</Label>
              <ImageUploadGrid files={values.images} onChange={(files) => setField("images", files)} max={5} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="Enter title"
                  value={values.title}
                  onChange={(e) => setField("title", e.target.value.slice(0, titleLimit))}
                  className="rounded-full"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {values.title.length}/{titleLimit}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe the item in detail"
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value.slice(0, descLimit))}
                  className="resize-y"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {values.description.length}/{descLimit}
                </div>
              </div>
            </div>

            {/* Location same as profile */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-xs text-muted-foreground">Same as Store/Individual Location</p>
              </div>
              <Switch
                checked={values.locationSameAsProfile}
                onCheckedChange={(v) => {
                  setValues((prev) => ({
                    ...prev,
                    locationSameAsProfile: v,
                    city: v ? undefined : prev.city,
                    neighborhood: v ? undefined : prev.neighborhood,
                  }))
                }}
                aria-label="Use profile location"
              />
            </div>

            {!values.locationSameAsProfile && (
              <LocationFields
                value={{ city: values.city, neighborhood: values.neighborhood }}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, city: next.city, neighborhood: next.neighborhood }))
                }
                className="mt-2"
              />
            )}

            {/* Phone & visibility */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">Your Phone Number</Label>
                <Input value={values.phone} onChange={(e) => setField("phone", e.target.value)} className="w-44" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Show my phone number in ad</span>
                <Switch
                  checked={values.showPhoneInAd}
                  onCheckedChange={(v) => setField("showPhoneInAd", v)}
                  aria-label="Show phone number"
                />
              </div>
            </div>

            {/* Seller kind */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">Store / Individual</Label>
                <p className="text-xs text-muted-foreground">Defaults to your seller profile.</p>
              </div>
              <Select
                value={values.sellerKind}
                onValueChange={(v: "store" | "individual") => setField("sellerKind", v)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Your Role" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className="rounded-full px-6 transition-transform hover:translate-y-[-1px]"
                onClick={() => {
                  if (values.type) {
                    if (values.type === "offer") {
                      router.push(`/post-ad/offer?type=${values.type}`)
                    } else if (values.type === "service") {
                      router.push(`/post-ad/service?type=${values.type}`)
                    } else if (values.type === "event") {
                      router.push(`/post-ad/event?type=${values.type}`)
                    } else if (values.type === "explore") {
                      router.push(`/post-ad/explore?type=${values.type}`)
                    } else {
                      router.push(`/post-ad/product?type=${values.type}`)
                    }
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
  )
}
