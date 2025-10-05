"use client"

import * as React from "react"
import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { type BillingPeriod, BillingPlanCards } from "@/components/post-ad/billing-plan-cards"
import { Card } from "@/components/common/shadecn-card"
import { Separator } from "@/components/common/separator"
import { Button } from "@/components/common/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BackLink } from "@/components/common/back-link"

export default function BillingPage() {
  const router = useRouter()
  const [period, setPeriod] = React.useState<BillingPeriod>("monthly")

  const basePrice = 8 // KD per month
  const annualDiscountPercent = 20 // Save 20% badge
  const annualBase = basePrice * 12
  const annualAfterDiscount = annualBase * (1 - annualDiscountPercent / 100)

  const totalDisplay =
    period === "monthly"
      ? { label: "Total", value: `${basePrice} KD / mo`, strike: undefined }
      : { label: "Total", value: `${annualAfterDiscount.toFixed(1)} KD / yr`, strike: `${annualBase} KD` }

  return (
    <PageContainer>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Select Payment Mode</h2>
        <BillingPlanCards value={period} onChange={setPeriod} />
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-base font-semibold">Pricing Overview</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Base Price (Product)</div>
              <div className="text-base font-semibold">{basePrice} KD</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Annual Discount</div>
              <div className="text-base font-semibold">{annualDiscountPercent}%</div>
            </div>

            <Separator />

            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium">{totalDisplay.label}</div>
              <div className="space-x-2">
                {totalDisplay.strike ? (
                  <span className="text-sm text-muted-foreground line-through">{totalDisplay.strike}</span>
                ) : null}
                <span className="text-base font-semibold text-primary">{totalDisplay.value}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-end">
          <Button variant={'primary'} className={cn("rounded-full px-6")} onClick={() => router.push("/post-ad/success")}>
            Post Ad
          </Button>
        </div>
      </section>
    </PageContainer>
  )
}
