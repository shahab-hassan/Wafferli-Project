"use client"

import { Card } from "@/components/common/shadecn-card"
import { cn } from "@/lib/utils"

export default function LocationCard({
  mapImageUrl,
  label,
  address,
  mapsLink,
  className,
}: {
  mapImageUrl: string
  label?: string
  address?: string
  mapsLink: string
  className?: string
}) {
  return (
    <Card className={cn("overflow-hidden w-[70vw] sm:w-[420px] md:w-[460px] max-w-full p-0", className)}>
      <div className="w-full aspect-video overflow-hidden">
        <img
          src={mapImageUrl || "/placeholder.svg?height=160&width=320&query=map%20placeholder"}
          alt={label ? `Map showing ${label}` : "Map location"}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
      <div className="p-4">
        {label && <div className="font-semibold mb-1">{label}</div>}
        {address && <div className="text-sm text-muted-foreground break-words">{address}</div>}
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm underline break-words break-all"
          style={{ color: "var(--color-secondary)" }}
        >
          {mapsLink}
        </a>
      </div>
    </Card>
  )
}
