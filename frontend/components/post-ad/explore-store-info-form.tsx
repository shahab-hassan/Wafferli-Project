"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Button } from "@/components/common/button"
import { cn } from "@/lib/utils"
import { MapPin, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageUploadGrid } from "./image-upload-grid"
import { LocationFields } from "./location-field"

type Values = {
  images: File[]
  city?: string
  neighborhood?: string
  category?: string
}

export function ExploreStoreInfoForm({ onChangeType }: { onChangeType: () => void }) {
  const [values, setValues] = React.useState<Values>({ images: [] })
  const setField = <K extends keyof Values>(k: K, v: Values[K]) => setValues((p) => ({ ...p, [k]: v }))
  const router = useRouter()

  const valid = values.images.length > 0 && !!values.city && !!values.neighborhood && !!values.category

  return (
    <div className="space-y-6">
      {/* Type summary */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Explore</div>
              <div className="text-xs text-muted-foreground">Any store, place, or attraction.</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Store Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Store Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Images */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Images{values.images.length === 0 ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <ImageUploadGrid files={values.images} onChange={(files) => setField("images", files)} max={5} />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Location
                {!(values.city && values.neighborhood) ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <LocationFields
                value={{ city: values.city, neighborhood: values.neighborhood }}
                onChange={(next) => setValues((p) => ({ ...p, city: next.city, neighborhood: next.neighborhood }))}
              />
            </div>

            {/* Category */}
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">
                Category{!values.category ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <Select value={values.category} onValueChange={(v) => setField("category", v)}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="attractions">Attractions</SelectItem>
                  <SelectItem value="parks">Parks</SelectItem>
                </SelectContent>
              </Select>
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

export default ExploreStoreInfoForm
