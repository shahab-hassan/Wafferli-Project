"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CalendarDays, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdItem } from "@/components/my-ads/ads-list"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"

const ADS: AdItem[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: ["featured"],
    clicks: 12,
    views: 50,
  },
  {
    id: "2",
    title: "AC Repair & Maintenance",
    subtitle: "24/7 emergency AC repair service",
    inStock: true,
    price: 15,
    crossedPrice: undefined,
    badges: ["Service", "Home & Personal Services", "Repair"],
    status: "active",
    labels: [],
    clicks: 30,
    views: 210,
  },
  {
    id: "3",
    title: 'MacBook Pro 16"',
    subtitle: "M3 Pro, 18GB RAM, 512GB SSD",
    inStock: true,
    price: 1200,
    crossedPrice: 1350,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 19,
    views: 160,
  },
]

export default function BoostAdDetailsPage() {
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const router = useRouter()
  const ad = useMemo(() => ADS.find((a) => a.id === params.id), [params.id])

  const basePrice = 8
  const [selected, setSelected] = useState<"featured" | "sponsored">("sponsored")
  const selectedPrice = selected === "featured" ? 10 : 25
  const total = basePrice + selectedPrice

  if (!ad) {
    return (
      <main className="mx-auto max-w-[1440px] py-6">
        <p>
          Ad not found.{" "}
          <Link className="text-primary underline" href="/boost-ads">
            Go back
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main
      className="min-h-dvh"
      style={
        {
          ["--primary" as any]: "#762c85",
          ["--secondary" as any]: "#e71e86",
          ["--accent" as any]: "#fecd07",
          ["--success" as any]: "#22c55e",
        } as React.CSSProperties
      }
    >
      <div
        className="mx-auto w-full max-w-[1440px] py-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
        </div>

        <h1 className="text-center text-2xl font-bold text-[var(--primary)]">Boost Ad Listing</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Selected Ad summary */}
            <Card className="border-0 shadow-none ring-1 ring-border">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 overflow-hidden rounded-md bg-muted">
                    <img
                      src="/why-boost.png"
                      alt={`${ad.title} image`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">Selected Ad</div>
                    <div className="text-sm text-muted-foreground">{ad.title}</div>
                  </div>
                </div>
                <Link href="/boost-ads" className="text-sm font-medium text-[var(--primary)] hover:underline">
                  Change
                </Link>
              </CardContent>
            </Card>

            {/* Choose Boost Options */}
            <section>
              <h2 className="mb-3 text-xl font-semibold">Choose Boost Options</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelected("featured")}
                  className={cnOption(selected === "featured")}
                  aria-pressed={selected === "featured"}
                >
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Featured
                  </span>
                  <div className="text-[var(--secondary)]">+10 KD</div>
                  <div className="text-xs text-muted-foreground">Next 2 rows placement</div>
                </button>

                <button
                  onClick={() => setSelected("sponsored")}
                  className={cnOption(selected === "sponsored")}
                  aria-pressed={selected === "sponsored"}
                >
                  <span className="inline-block rounded-full bg-[var(--secondary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--secondary)]">
                    Sponsored
                  </span>
                  <div className="text-[var(--secondary)]">+25 KD</div>
                  <div className="text-xs text-muted-foreground">Top 3-4 positions</div>
                </button>
              </div>
            </section>

            {/* Pricing Overview */}
            <section>
              <h2 className="mb-3 text-xl font-semibold">Pricing Overview</h2>
              <Card className="border-0 shadow-none ring-1 ring-border">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Base Price</span>
                    <span className="text-sm font-medium">{basePrice} KD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selected === "featured" ? "Featured" : "Sponsored"} Pricing
                    </span>
                    <span className="text-sm font-medium text-[var(--secondary)]">+{selectedPrice} KD</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-base font-semibold">{total} KD</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Valid Until September 30, 2025</span>
                  </div>

                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded" />
                    <span>
                      I agree to the{" "}
                      <a className="text-[var(--primary)] underline" href="#">
                        Terms & Service
                      </a>{" "}
                      and the end date of my ad boosting.
                    </span>
                  </label>

                  <div className="flex justify-end">
                    <Button
                      className="rounded-full bg-amber-500 text-black hover:bg-amber-500/90"
                      onClick={() => {
                        toast({ title: "Boost applied", description: `Your ad is now ${selected}.` })
                        router.push("/boost-ad-listing")
                      }}
                    >
                      ⚡ Boost Ad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column: Illustration panel */}
          <aside>
            <Card className="overflow-hidden border-0 shadow-none ring-1 ring-border">
              <CardContent className="p-0">
                <img
                  src="/why-boost.png"
                  alt="Why Boost Ads illustration"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

function cnOption(active: boolean) {
  return [
    "w-[220px] rounded-2xl border px-4 py-3 text-left",
    active ? "border-[var(--secondary)] ring-1 ring-[var(--secondary)]" : "border-border",
  ].join(" ")
}
