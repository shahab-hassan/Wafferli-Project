"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { CreditCard } from "lucide-react"

export function PaymentMethodCard({
  brand,
  last4,
  name,
  expiry,
  lastSuccess,
  onUpdate,
}: {
  brand: string
  last4: string
  name: string
  expiry: string
  lastSuccess: string
  onUpdate: () => void
}) {
  return (
    <Card style={{ background: "linear-gradient(180deg, rgba(118,44,133,0.04), rgba(231,30,134,0.02))" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl bg-foreground p-4 text-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">{brand}</span>
            </div>
            <span className="text-sm">•••• •••• •••• {last4}</span>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm">
            <div>{name}</div>
            <div>Expires {expiry}</div>
          </div>
        </div>

        <div
          className="rounded-md bg-success/10 p-2 text-sm"
          style={{ background: "var(--success)1a", color: "var(--success)" }}
        >
          Last successful payment: {lastSuccess}.{" "}
          <button className="font-medium underline underline-offset-2" onClick={() => onUpdate()}>
            View More
          </button>
        </div>

        <Button variant="outline" onClick={onUpdate}>
          Update Payment Method
        </Button>
      </CardContent>
    </Card>
  )
}
