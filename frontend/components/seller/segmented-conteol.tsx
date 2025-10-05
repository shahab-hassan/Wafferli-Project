"use client"

import { cn } from "@/lib/utils"

export function BusinessTypeToggle({
  value,
  onChange,
  leftLabel,
  rightLabel,
}: {
  value: "individual" | "business"
  onChange: (v: "individual" | "business") => void
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div role="tablist" aria-label="Business Type" className="grid grid-cols-2 gap-3">
      {(
        [
          { id: "individual", label: leftLabel },
          { id: "business", label: rightLabel },
        ] as const
      ).map((opt) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[999px] border px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "border-[color-mix(in oklab,primary 65%, white)] bg-[color-mix(in oklab,primary 12%, white)] text-primary ring-2 ring-[color-mix(in oklab,primary 35%, white)]"
                : "border-border bg-[var(--brand-surface)] text-[var(--brand-ink)] hover:bg-[color-mix(in oklab,primary 6%, white)]",
            )}
            onClick={() => onChange(opt.id)}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full border",
                active
                  ? "border-primary bg-primary]"
                  : "border-border bg-white",
              )}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
