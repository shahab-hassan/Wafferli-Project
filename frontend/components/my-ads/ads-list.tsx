"use client"

import { AdCard, type AdCardProps } from "@/components/my-ads/ad-card"

export type AdItem = Omit<AdCardProps, "onToggleStatus" | "onDelete"> & {
  id: string
}

export function AdsList({
  ads,
  onToggleStatus,
  onDelete,
  onBoost,
}: {
  ads: AdItem[]
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onBoost: (id: string, type: "featured" | "sponsored") => void
}) {
  return (
    <div className="space-y-4">
      {ads.map((a) => (
        <div key={a.id} className="min-w-0">
          <AdCard {...a} onToggleStatus={onToggleStatus} onDelete={onDelete} />
        </div>
      ))}
      {ads.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No ads match your current filters.
        </div>
      ) : null}
    </div>
  )
}
