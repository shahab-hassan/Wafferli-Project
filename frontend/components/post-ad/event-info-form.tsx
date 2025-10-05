"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Button } from "@/components/common/button"
import { EnhancedCheckbox } from "@/components/common/enhanced-checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { Calendar } from "@/components/common/calender"
import { Input } from "@/components/common/input"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, PartyPopper, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

type EventInfoValues = {
  eventType?: string
  date?: Date
  timeStart?: string
  timeEnd?: string
  features: string[]
}

function formatDDMMYYYY(d?: Date) {
  if (!d) return ""
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

export function EventInfoForm({ onChangeType }: { onChangeType: () => void }) {
  const [values, setValues] = React.useState<EventInfoValues>({ features: [] })
  const [open, setOpen] = React.useState(false)
  const setField = <K extends keyof EventInfoValues>(k: K, v: EventInfoValues[K]) =>
    setValues((p) => ({ ...p, [k]: v }))
  const router = useRouter()

  const toggleFeature = (f: string) =>
    setValues((p) => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
    }))

  const valid = !!values.eventType && !!values.date && !!values.timeStart && !!values.timeEnd

  return (
    <div className="space-y-6">
      {/* Type summary */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PartyPopper className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Event</div>
              <div className="text-xs text-muted-foreground">Exciting events happening around Kuwait.</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Event Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Event Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Event Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Event Type{!values.eventType ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <Select value={values.eventType} onValueChange={(v) => setField("eventType", v)}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Choose an event type" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date{!values.date ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <div className="relative w-full sm:w-64">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-full border bg-background px-10 py-2.5 text-left text-sm",
                        !values.date && "text-muted-foreground",
                      )}
                    >
                      {formatDDMMYYYY(values.date) || "dd-mm-yyyy"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={values.date}
                      onSelect={(d) => {
                        setField("date", d)
                        setOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Time{!(values.timeStart && values.timeEnd) ? <span className="ml-0.5 text-destructive">*</span> : null}
              </Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-40"
                    value={values.timeStart ?? ""}
                    onChange={(e) => setField("timeStart", e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-40"
                    value={values.timeEnd ?? ""}
                    onChange={(e) => setField("timeEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Features & Amenities</div>
              <div className="space-y-3">
                {["Family Friendly", "Parking available", "Wheelchair accessible", "Indoor", "Free entry"].map(
                  (label) => (
                    <label key={label} className="flex items-center gap-3 text-sm">
                      <EnhancedCheckbox
                        checked={values.features.includes(label)}
                        onCheckedChange={() => toggleFeature(label)}
                        aria-label={label}
                      />
                      <span>{label}</span>
                    </label>
                  ),
                )}
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
