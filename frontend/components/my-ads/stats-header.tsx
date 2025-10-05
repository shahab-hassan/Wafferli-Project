"use client"

import type React from "react"

import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Zap, Eye, MousePointer2, Rocket, CreditCard, Wallet } from "lucide-react"
import Link from "next/link"

type Stats = { active: number; clicks: number; views: number }

export function StatsHeader({
  onBoostAll,
  onViewPayment,
  onUpdatePayment,
  stats,
}: {
  onBoostAll: () => void
  onViewPayment: () => void
  onUpdatePayment: () => void
  stats: Stats
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Profile</p>
          <h1 className="text-pretty text-2xl font-semibold tracking-tight">My Ads</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link href={'/boost-ad-listing'}>
          <Button
          variant={'tertiary'}
            onClick={onBoostAll}
            size="sm"
            className="w-full sm:w-auto hover:opacity-90"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Boost Ad Listing
          </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewPayment}
            className="w-full sm:w-auto rounded-full bg-transparent"
          >
            <Wallet className="mr-2 h-4 w-4" />
            View Payment History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdatePayment}
            className="w-full sm:w-auto rounded-full bg-transparent"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Update Payment Method
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<MousePointer2 className="h-5 w-5" />}
          value={stats.active}
          label="Total Active Ads"
          color="var(--primary)"
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          value={stats.clicks}
          label="Total Clicks"
          color="var(--secondary)"
        />
        <StatCard icon={<Eye className="h-5 w-5" />} value={stats.views} label="Total Views" color="var(--success)" />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
}) {
  return (
    <Card
      className="border-none shadow-none ring-1 ring-inset ring-border"
      style={{
        background: `linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), linear-gradient(180deg, ${color}1a, ${color}1a)`,
      }}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="grid h-10 w-10 place-items-center rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xl font-semibold leading-none">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
