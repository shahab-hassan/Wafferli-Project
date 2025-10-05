"use client"

import { Input } from "@/components/common/input"
import { Badge } from "@/components/common/badge"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

type Counts = {
  all: number
  active: number
  inactive: number
  pending: number
  rejected: number
  sponsored: number
  featured: number
}

export function SearchFilters({
  value,
  onChange,
  activeFilter,
  onFilterChange,
  counts,
}: {
  value: string
  onChange: (v: string) => void
  activeFilter: "all" | "active" | "inactive" | "pending" | "rejected" | "sponsored" | "featured"
  onFilterChange: (f: any) => void
  counts: Counts
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by Ad Title"
          className="pl-9"
        />
      </div>

      <div role="tablist" aria-label="Ad filters" className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", "View All", counts.all],
            ["active", "Active Ads", counts.active],
            ["inactive", "Inactive Ads", counts.inactive],
            ["pending", "Pending Ads", counts.pending],
            ["rejected", "Rejected Ads", counts.rejected],
            ["sponsored", "Sponsored Ads", counts.sponsored],
            ["featured", "Featured Ads", counts.featured],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeFilter === key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm w-full sm:w-auto",
              activeFilter === key ? "border-transparent bg-primary/10 text-primary" : "bg-background hover:bg-muted",
            )}
          >
            <span className="truncate">{label}</span>
            <Badge variant="secondary" className="rounded-full">
              {count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
