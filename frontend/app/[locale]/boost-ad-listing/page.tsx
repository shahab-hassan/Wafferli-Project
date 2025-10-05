"use client"

import type React from "react"

import Link from "next/link"
import { useMemo } from "react"
import { ChevronLeft } from "lucide-react"
import { BoostAdCard } from "@/components/cards/boost-ad-card"
import type { AdItem } from "@/components/my-ads/ads-list"

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
  // add a few repeated to fill the grid visually
  {
    id: "4",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 5,
    views: 25,
  },
  {
    id: "5",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 5,
    views: 25,
  },
  {
    id: "6",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 5,
    views: 25,
  },
  {
    id: "7",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 5,
    views: 25,
  },
  {
    id: "8",
    title: "iPhone 15 Pro Max",
    subtitle: "256GB, Titanium Blue, Unlocked",
    inStock: true,
    price: 450,
    crossedPrice: 520,
    badges: ["Product", "Apple", "Brand New"],
    status: "active",
    labels: [],
    clicks: 5,
    views: 25,
  },
]

export default function BoostAdsListingPage() {
  const ads = useMemo(() => ADS, [])

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
        className="mx-auto w-full max-w-[1440px] mb-10 mt-10"
      >
        <div className="mb-4 flex items-center gap-2">
          <Link href="/my-ads" className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline">
            <ChevronLeft className="h-5 w-5" />
            Back
          </Link>
        </div>

        <h1 className="text-center text-2xl font-bold text-[var(--primary)]">Boost Ad Listing</h1>
        <h2 className="mt-6 text-pretty text-xl font-semibold">Select an Ad to Boost</h2>

        {/* Listing grid */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ads.map((ad) => (
            <BoostAdCard key={ad.id} ad={ad} href={`/boost-ad-listing/${ad.id}`} />
          ))}
        </div>
      </div>
    </main>
  )
}
