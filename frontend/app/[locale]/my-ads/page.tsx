"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { StatsHeader } from "@/components/my-ads/stats-header"
import { SearchFilters } from "@/components/my-ads/search-filter"
import { AdsList, type AdItem } from "@/components/my-ads/ads-list"
import { PaymentMethodCard } from "@/components/my-ads/payment-method-card"
import { AdsBoostOptions } from "@/components/my-ads/ads-boost-options"
import { BudgetPlanner } from "@/components/my-ads/budget-planner"
import { PaymentHistoryTable } from "@/components/my-ads/payment-history-table"
import { PaginationBar } from "@/components/my-ads/pagination"

// Sample seed data to render the UI closely to the reference
const SEED_ADS: AdItem[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked...",
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
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked...",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "inactive",
    labels: ["sponsored"],
    clicks: 12,
    views: 50,
  },
  {
    id: "3",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked...",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "pending",
    labels: [],
    clicks: 0,
    views: 0,
  },
  {
    id: "4",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked...",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "rejected",
    labels: [],
    clicks: 0,
    views: 0,
  },
]

export default function MyAdsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive" | "pending" | "rejected" | "sponsored" | "featured"
  >("all")
  const [ads, setAds] = useState<AdItem[]>(SEED_ADS)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = ads
    if (activeFilter !== "all") {
      if (activeFilter === "sponsored" || activeFilter === "featured") {
        list = list.filter((a) => a.labels.includes(activeFilter))
      } else {
        list = list.filter((a) => a.status === activeFilter)
      }
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q))
    }
    return list
  }, [ads, activeFilter, query])

  function onToggleStatus(id: string) {
    setAds((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "active" ? "inactive" : "active",
            }
          : a,
      ),
    )
  }

  function onDelete(id: string) {
    setAds((prev) => prev.filter((a) => a.id !== id))
    toast({ title: "Ad deleted" })
  }

  function onBoost(id: string, type: "featured" | "sponsored") {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, labels: Array.from(new Set([...a.labels, type])) } : a)))
    toast({ title: `Boost applied`, description: `Your ad is now ${type}.` })
  }

  return (
    // Define brand tokens locally for this page scope
    <main
      className="min-h-dvh overflow-x-hidden mt-4" // added overflow-x-hidden
      style={
        {
          // brand and system tokens
          ["--primary" as any]: "#762c85",
          ["--secondary" as any]: "#e71e86",
          ["--accent" as any]: "#fecd07",
          // extra semantic helpers
          ["--tertiary" as any]: "#fecd07",
          ["--success" as any]: "#22c55e",
          ["--ring" as any]: "oklch(0.708 0 0)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="mb-4">
          <StatsHeader
            onBoostAll={() => toast({ title: "Boost Ad Listing", description: "This is a demo action." })}
            onViewPayment={() => {
              const el = document.getElementById("payment-history")
              el?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            onUpdatePayment={() => toast({ title: "Update Payment Method", description: "This is a demo action." })}
            stats={{
              active: ads.filter((a) => a.status === "active").length,
              clicks: ads.reduce((acc, a) => acc + a.clicks, 0),
              views: ads.reduce((acc, a) => acc + a.views, 0),
            }}
          />
        </div>

        <div className="mb-4">
          <SearchFilters
            value={query}
            onChange={setQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={{
              all: ads.length,
              active: ads.filter((a) => a.status === "active").length,
              inactive: ads.filter((a) => a.status === "inactive").length,
              pending: ads.filter((a) => a.status === "pending").length,
              rejected: ads.filter((a) => a.status === "rejected").length,
              sponsored: ads.filter((a) => a.labels.includes("sponsored")).length,
              featured: ads.filter((a) => a.labels.includes("featured")).length,
            }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <section aria-label="Your ads" className="min-w-0 space-y-4">
            {" "}
            <AdsList ads={filtered} onToggleStatus={onToggleStatus} onDelete={onDelete} onBoost={onBoost} />
            <PaginationBar page={page} totalPages={3} onChange={(p) => setPage(p)} />
          </section>

          <aside className="min-w-0 space-y-4">
            {" "}
            <PaymentMethodCard
              brand="Visa"
              last4="1234"
              name="Daud"
              expiry="12/27"
              lastSuccess="Apr 25, 2025"
              onUpdate={() => alert("Demo: Update Payment Method")}
            />
            <AdsBoostOptions
              onApply={(type) => {
                const first = filtered[0]
                if (first) onBoost(first.id, type)
                else toast({ title: "No ad selected", description: "Filter resulted in no ads." })
              }}
            />
            <BudgetPlanner />
          </aside>
        </div>

        <section id="payment-history" className="mt-8">
          <PaymentHistoryTable />
        </section>
      </div>
    </main>
  )
}
