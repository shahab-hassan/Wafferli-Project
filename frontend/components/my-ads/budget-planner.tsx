"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Minus, Plus } from "lucide-react"
import React from "react"

type RowKey = "explore" | "events" | "products" | "services" | "offers"

const BASES: Record<RowKey, number> = {
  explore: 15,
  events: 12,
  products: 8,
  services: 10,
  offers: 6,
}

function Stepper({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Button type="button" variant="outline" size="icon" onClick={() => onChange(Math.max(0, value - 1))}>
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-8 text-center text-sm font-medium">{value}</div>
      <Button type="button" variant="outline" size="icon" onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function BudgetPlanner() {
  const [counts, setCounts] = React.useState<Record<RowKey, number>>({
    explore: 0,
    events: 0,
    products: 0,
    services: 0,
    offers: 0,
  })
  const [tier, setTier] = React.useState<Record<RowKey, "standard" | "premium">>({
    explore: "standard",
    events: "standard",
    products: "standard",
    services: "standard",
    offers: "standard",
  })

  const monthly = (Object.keys(counts) as RowKey[]).reduce((sum, k) => {
    const base = BASES[k]
    const mult = tier[k] === "premium" ? 1.5 : 1
    return sum + counts[k] * base * mult
  }, 0)

  const yearly = Math.round(monthly * 12 * 0.94) // Save 6%

  function row(label: string, key: RowKey) {
    return (
      <div
        className="grid min-w-0 grid-cols-1 items-center gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_auto_auto]"
        key={key}
      >
        <div className="min-w-0 text-sm">
          <div className="font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{BASES[key]} KD base</div>
        </div>
        <Stepper value={counts[key]} onChange={(n) => setCounts((s) => ({ ...s, [key]: n }))} />
        <Select value={tier[key]} onValueChange={(v) => setTier((s) => ({ ...s, [key]: v as any }))}>
          <SelectTrigger className="min-w-[80px]">
            <SelectValue placeholder="Standard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Card
      className="overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(118,44,133,0.04), rgba(231,30,134,0.02))" }}
    >
      <CardHeader>
        <CardTitle className="text-base">Plan Your Advertising Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {row("Explore", "explore")}
        {row("Events", "events")}
        {row("Products", "products")}
        {row("Services", "services")}
        {row("Offers", "offers")}

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Monthly Cost</div>
            <div className="text-xl font-semibold">{monthly} KD</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Annually Cost</div>
            <div className="text-xl font-semibold">{yearly} KD</div>
            <div className="text-xs text-muted-foreground">Save 6%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
