"use client"

import * as React from "react"
import { Card } from "@/components/common/shadecn-card"
import { Label } from "@/components/common/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Button } from "@/components/common/button"
import { cn } from "@/lib/utils"
import { Wrench, ChevronRight } from "lucide-react"

type Values = {
  category?: string
  subcategory?: string
}

export function EditServiceInfoForm({
  onChangeType,
  onContinue,
}: {
  onChangeType: () => void
  onContinue?: (values: Values) => void
}) {
  const [values, setValues] = React.useState<Values>({})
  const setField = <K extends keyof Values>(k: K, v: Values[K]) => setValues((p) => ({ ...p, [k]: v }))

  const valid = !!values.category && !!values.subcategory

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Service</div>
              <div className="text-xs text-muted-foreground">Any service you are offering.</div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Service Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
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
                  <SelectItem value="home-services">Home Services</SelectItem>
                  <SelectItem value="auto">Automotive</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="massage">Massage</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
