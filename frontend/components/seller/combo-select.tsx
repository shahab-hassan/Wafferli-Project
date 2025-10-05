"use client"

import * as React from "react"
import { Dropdown, type DropdownOption } from "@/components/common/dropdown" // adjust path

export function ComboSelect({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: string[]
  value?: string
  onChange: (v: string) => void
}) {
  // Convert string[] into DropdownOption[]
  const options: DropdownOption[] = React.useMemo(
    () => items.map((it) => ({ value: it, label: it })),
    [items]
  )

  return (
    <Dropdown
      label={label}
      placeholder={`Select ${label}`}
      options={options}
      value={value}
      onValueChange={onChange}
      variant="rounded" // or "rectangular"
    />
  )
}
