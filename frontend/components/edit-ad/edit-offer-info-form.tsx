"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Textarea } from "@/components/common/textarea"
import { Button } from "@/components/common/button"
import { Switch } from "@/components/common/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { Calendar } from "@/components/common/calender"
import { cn } from "@/lib/utils"
import { ChevronRight, CalendarIcon, Tag } from "lucide-react"

type Values = {
  flashDeal: boolean
  expiry?: Date
  discountDeal: boolean
  fullPrice?: string
  discountPercent?: string
  offerDetail?: string
}

function formatDDMMYYYY(d?: Date) {
  if (!d) return ""
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

export function EditOfferInfoForm({
  onChangeType,
  onContinue,
}: {
  onChangeType: () => void
  onContinue?: (values: Values) => void
}) {
  const [values, setValues] = React.useState<Values>({ flashDeal: false, discountDeal: false })
  const [open, setOpen] = React.useState(false)
  const setField = <K extends keyof Values>(k: K, v: Values[K]) => setValues((p) => ({ ...p, [k]: v }))

  const expiryValid = values.flashDeal ? !!values.expiry : true
  const discountPathValid = values.discountDeal
    ? !!values.fullPrice && !!values.discountPercent
    : !!values.offerDetail && values.offerDetail.trim().length > 0 && values.offerDetail.trim().length <= 70
  const valid = expiryValid && discountPathValid

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
              <div className="text-xs text-muted-foreground">Exclusive deal, flash deal, or package.</div>
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
                  Flash Deals are exclusive deals, that expire within 24h.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.flashDeal}
                  onCheckedChange={(v) => {
                    setField("flashDeal", v)
                    if (!v) setField("expiry", undefined)
                  }}
                  aria-label="Flash deal"
                />
                <span className="text-sm text-muted-foreground">{values.flashDeal ? "Yes" : "No"}</span>
              </div>
            </div>

            {values.flashDeal && (
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Expiry Date{!values.expiry ? <span className="ml-0.5 text-destructive">*</span> : null}
                </Label>
                <div className="relative w-64">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-full border bg-background px-10 py-2.5 text-left text-sm",
                          !values.expiry && "text-muted-foreground",
                        )}
                      >
                        {formatDDMMYYYY(values.expiry) || "dd-mm-yyyy"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={values.expiry}
                        onSelect={(d) => {
                          setField("expiry", d)
                          setOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-medium">Discount Deal</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={values.discountDeal}
                  onCheckedChange={(v) => setField("discountDeal", v)}
                  aria-label="Discount deal"
                />
                <span className="text-sm text-muted-foreground">{values.discountDeal ? "Yes" : "No"}</span>
              </div>
            </div>

            {values.discountDeal ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium">
                    Full Price
                    {!(values.fullPrice && values.fullPrice.trim().length > 0) ? (
                      <span className="ml-0.5 text-destructive">*</span>
                    ) : null}
                  </Label>
                  <div className="relative w-64">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      KWD
                    </span>
                    <Input
                      className="pl-12"
                      inputMode="decimal"
                      placeholder="Enter price before discount"
                      value={values.fullPrice ?? ""}
                      onChange={(e) => setField("fullPrice", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium">
                    Discount Percent
                    {!(values.discountPercent && values.discountPercent.trim().length > 0) ? (
                      <span className="ml-0.5 text-destructive">*</span>
                    ) : null}
                  </Label>
                  <div className="relative w-64">
                    <Input
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
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">
                  Offer Detail
                  {!(values.offerDetail && values.offerDetail.trim().length > 0) ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </Label>
                <div className="w-64">
                  <Textarea
                    rows={2}
                    maxLength={70}
                    placeholder="Describe the offer, e.g. package-deal, Buy 1 Get 1 Free"
                    value={values.offerDetail ?? ""}
                    onChange={(e) => setField("offerDetail", e.target.value)}
                  />
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    {values.offerDetail?.length ?? 0}/70
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn("rounded-full px-6 transition-transform hover:translate-y-[-1px]")}
                onClick={() => onContinue?.(values)}
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
