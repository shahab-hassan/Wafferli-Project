"use client"

import type * as React from "react"
import { Badge } from "@/components/common/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"

export type BillingPeriod = "monthly" | "annual"

export function BillingPlanCards({
  value,
  onChange,
  className,
}: {
  value: BillingPeriod
  onChange: (v: BillingPeriod) => void
  className?: string
}) {
  const Option = ({
    k,
    label,
    children,
  }: {
    k: BillingPeriod
    label: string
    children?: React.ReactNode
  }) => {
    const selected = value === k
    return (
      <Button
       variant="outline"
        onClick={() => onChange(k)}
        className="!rounded-[12px] !p-6 "
        aria-pressed={selected}
      >

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            {children}
          </div>
      </Button>
    )
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Option k="monthly" label="Monthly" />
      <Option k="annual" label="Annually">
        <Badge className="rounded-full" variant="secondary">
          Save 20%
        </Badge>
      </Option>
    </div>
  )
}
