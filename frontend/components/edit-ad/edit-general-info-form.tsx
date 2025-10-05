"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Textarea } from "@/components/common/textarea"
import { Switch } from "@/components/common/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Button } from "@/components/common/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { TypeSelector } from "@/components/post-ad/type-selector"
import { ImageUploadGrid } from "@/components/post-ad/image-upload-grid"
import { LocationFields } from "@/components/post-ad/location-field"
import type { PostType } from "@/types/post-ad"
import { useRouter } from "next/navigation"

type GeneralValues = {
  type: PostType | null
  images: File[]
  title: string
  description: string
  locationSameAsProfile: boolean
  phone: string
  showPhoneInAd: boolean
  sellerKind: "store" | "individual"
  city?: string
  neighborhood?: string
}

export function EditGeneralInfoForm({
  initialType = null,
}: {
  initialType?: PostType | null
}) {
  const [values, setValues] = React.useState<GeneralValues>({
    type: initialType,
    images: [],
    title: "iPhone 15 Pro Max",
    description: "256GB, Titanium Blue, Unlocked",
    locationSameAsProfile: true,
    phone: "+965 123456",
    showPhoneInAd: true,
    sellerKind: "individual",
  })

  const setField = <K extends keyof GeneralValues>(k: K, v: GeneralValues[K]) => setValues((p) => ({ ...p, [k]: v }))

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

  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Choose Type */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Choose Type</h2>
        <TypeSelector value={values.type} onChange={(v) => setField("type", v)} />
      </section>

      {/* General Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">General Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Images</Label>
              <ImageUploadGrid files={values.images} onChange={(files) => setField("images", files)} max={5} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title{values.title.trim() ? null : <span className="ml-0.5 text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="title"
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
                Description{values.description.trim() ? null : <span className="ml-0.5 text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  rows={5}
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value.slice(0, descLimit))}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {values.description.length}/{descLimit}
                </div>
              </div>
            </div>

            {/* Location toggle */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">
                  Location{locationValid ? null : <span className="ml-0.5 text-destructive">*</span>}
                </Label>
                <p className="text-xs text-muted-foreground">Same as Store/Individual Location</p>
              </div>
              <Switch
                checked={values.locationSameAsProfile}
                onCheckedChange={(v) => {
                  setValues((p) => ({
                    ...p,
                    locationSameAsProfile: v,
                    city: v ? undefined : p.city,
                    neighborhood: v ? undefined : p.neighborhood,
                  }))
                }}
                aria-label="Use profile location"
              />
            </div>

            {!values.locationSameAsProfile && (
              <LocationFields
                value={{ city: values.city, neighborhood: values.neighborhood }}
                onChange={(next) => setValues((p) => ({ ...p, city: next.city, neighborhood: next.neighborhood }))}
              />
            )}

            {/* Phone */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">Your Phone Number</Label>
              <Input value={values.phone} onChange={(e) => setField("phone", e.target.value)} className="w-44" />
            </div>

            {/* Phone visibility */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm">Show my phone number in ad</span>
              <Switch
                checked={values.showPhoneInAd}
                onCheckedChange={(v) => setField("showPhoneInAd", v)}
                aria-label="Show phone number"
              />
            </div>

            {/* Store / Individual */}
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
                  <SelectItem value="individual">Your Name</SelectItem>
                  <SelectItem value="store">Your Store</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn("rounded-full px-6 transition-transform hover:translate-y-[-1px]")}
                onClick={() => {
                  if (!values.type) return
                  router.push(`/edit-ad/${values.type}`)
                }}
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
