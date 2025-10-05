"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { cn } from "@/lib/utils"
import { MapPin, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/common/textarea"
import { Clock } from "lucide-react"

type ExploreInfoValues = {
  name: string
  description: string
  timeStart?: string
  timeEnd?: string
}

export function ExploreInfoForm({ onChangeType }: { onChangeType: () => void }) {
  const [values, setValues] = React.useState<ExploreInfoValues>({
    name: "",
    description: "",
  })
  const setField = <K extends keyof ExploreInfoValues>(k: K, v: ExploreInfoValues[K]) =>
    setValues((p) => ({ ...p, [k]: v }))

  const router = useRouter()
  const nameLimit = 70
  const descLimit = 1024
  const valid =
    values.name.trim().length > 0 &&
    values.name.trim().length <= nameLimit &&
    values.description.trim().length > 0 &&
    values.description.trim().length <= descLimit &&
    !!values.timeStart &&
    !!values.timeEnd

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
              <div className="text-xs text-muted-foreground">Places and activities to discover in Kuwait.</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Place Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Place Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="place-name" className="text-sm font-medium">
                Name{values.name.trim().length === 0 ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <div className="relative">
                <Input
                  id="place-name"
                  placeholder="Enter your Store Name"
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value.slice(0, nameLimit))}
                  className="rounded-full"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {values.name.length}/{nameLimit}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="place-description" className="text-sm font-medium">
                Description
                {values.description.trim().length === 0 ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <div className="relative">
                <Textarea
                  id="place-description"
                  rows={5}
                  placeholder="Enter the description of your business"
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value.slice(0, descLimit))}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {values.description.length}/{descLimit}
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Timings
                {!(values.timeStart && values.timeEnd) ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-40 rounded-full"
                    value={values.timeStart ?? ""}
                    onChange={(e) => setField("timeStart", e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-40 rounded-full"
                    value={values.timeEnd ?? ""}
                    onChange={(e) => setField("timeEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn("rounded-full px-6 transition-transform hover:translate-y-[-1px]")}
                onClick={() => router.push("/post-ad/explore/store")}
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
