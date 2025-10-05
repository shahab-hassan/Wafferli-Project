"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { Rocket } from "lucide-react"

export function AdsBoostOptions({
  onApply,
}: {
  onApply: (type: "featured" | "sponsored") => void
}) {
  return (
    <Card style={{ background: "linear-gradient(180deg, rgba(118,44,133,0.04), rgba(231,30,134,0.02))" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Ads Boost Options</CardTitle>
        <div className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-1 text-xs font-medium text-black">
          <Rocket className="h-3.5 w-3.5" />
          Boost
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3 gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">+10 KD</div>
            <div className="text-xs text-muted-foreground">Featured — Next 2 rows placement</div>
          </div>
          <Button
          variant={'secondary'}
            onClick={() => onApply("featured")}
            size="sm"
            className="rounded-full"
          >
            Apply
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">+25 KD</div>
            <div className="text-xs text-muted-foreground">Sponsored — Top 3-4 positions</div>
          </div>
          <Button
            variant={'secondary'}
            onClick={() => onApply("sponsored")}
            size="sm"
            className="rounded-full bg-[var(--secondary)] text-white hover:opacity-90 shrink-0"
          >
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
