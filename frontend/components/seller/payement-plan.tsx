"use client"

import { Check } from "lucide-react"
import { useId, useState } from "react"
import { cn } from "@/lib/utils"

export function PaymentPlan({
  id,
  label,
  price,
  badge,
  defaultChecked,
}: {
  id: string
  label: string
  price: string
  badge?: string
  defaultChecked?: boolean
}) {
  const baseId = useId()
  const [checked, setChecked] = useState(!!defaultChecked)

  return (
    <label
      htmlFor={`${baseId}-${id}`}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-[16px] border p-4",
        checked
          ? "border-[color-mix(in oklab,primary 65%, white)] bg-[color-mix(in oklab,primary 10%, white)]"
          : "border-border bg-[var(--brand-surface)] hover:bg-[color-mix(in oklab,primary 6%, white)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-5 w-5 place-items-center rounded-full border",
            checked
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
              : "border-[var(--brand-border)] bg-white",
          )}
        >
          {checked && <Check className="h-3.5 w-3.5" />}
        </span>
        <div>
          <div className="text-sm font-medium text-[var(--brand-ink)]">{label}</div>
          <div className="text-xs text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">{price}</div>
        </div>
      </div>
      {badge && (
        <span className="rounded-full border border-[color-mix(in oklab,var(--brand-primary) 45%, white)] bg-white px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
          {badge}
        </span>
      )}
      <input
        id={`${baseId}-${id}`}
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
        aria-checked={checked}
      />
    </label>
  )
}
