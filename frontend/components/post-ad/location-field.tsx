"use client"

import * as React from "react"
import { Label } from "@/components/common/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { cn } from "@/lib/utils"

type Props = {
  value: { city?: string; neighborhood?: string }
  onChange: (next: { city?: string; neighborhood?: string }) => void
  className?: string
  // Optional options for reuse; defaults provided
  cities?: { id: string; name: string }[]
  neighborhoods?: { id: string; name: string; cityId?: string }[]
}

export function LocationFields({
  value,
  onChange,
  className,
  cities = [
    { id: "kw-city", name: "Kuwait City" },
    { id: "hawalli", name: "Hawalli" },
    { id: "farwaniya", name: "Farwaniya" },
  ],
  neighborhoods = [
    { id: "salmiya", name: "Salmiya", cityId: "hawalli" },
    { id: "jabriya", name: "Jabriya", cityId: "hawalli" },
    { id: "salhiya", name: "Salhiya", cityId: "kw-city" },
  ],
}: Props) {
  const filteredNeighborhoods = React.useMemo(() => {
    if (!value.city) return neighborhoods
    return neighborhoods.filter((n) => !n.cityId || n.cityId === value.city)
  }, [neighborhoods, value.city])

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          City{!value.city ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
        <Select
          value={value.city}
          onValueChange={(v) => {
            // reset neighborhood if city changes
            onChange({ city: v, neighborhood: undefined })
          }}
        >
          <SelectTrigger className="w-full transition hover:ring-2 hover:ring-primary/20" aria-label="Select City">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Neighbourhood{!value.neighborhood ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
        <Select
          value={value.neighborhood}
          onValueChange={(v) => onChange({ ...value, neighborhood: v })}
          disabled={!value.city}
        >
          <SelectTrigger
            className="w-full transition hover:ring-2 hover:ring-primary/20"
            aria-label="Select Neighbourhood"
          >
            <SelectValue placeholder="Select Neighbourhood" />
          </SelectTrigger>
          <SelectContent>
            {filteredNeighborhoods.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default LocationFields
