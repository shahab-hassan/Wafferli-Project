"use client"

import { useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/common/dailog"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ScrollArea } from "@/components/common/scroll-area"
import { MapPin, LocateFixed, Search } from "lucide-react"

export type PickedLocation = {
  lat: number
  lng: number
  label?: string
  address?: string
  mapImageUrl: string
  mapsLink: string
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPick: (p: PickedLocation) => void
}

const POPULAR_KW = ["Kuwait City", "Salmiya", "Rumaithiya", "The Avenues Mall, Kuwait", "Kuwait International Airport"]

export default function LocationPicker({ open, onOpenChange, onPick }: Props) {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!open) {
      setQ("")
      setResults([])
    }
  }, [open])

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=kw&q=${encodeURIComponent(
          query,
        )}`,
        { headers: { "Accept-Language": "en" } },
      )
      const json = await res.json()
      setResults(Array.isArray(json) ? json : [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const useCurrent = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported in this browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = +pos.coords.latitude.toFixed(6)
        const lng = +pos.coords.longitude.toFixed(6)
        let address: string | undefined
        let label: string | undefined
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
            headers: { "Accept-Language": "en" },
          })
          if (resp.ok) {
            const data = await resp.json()
            address = data?.display_name
            label = data?.address?.suburb || data?.address?.city || data?.address?.town
          }
        } catch {}
        onPick(toPicked({ lat, lon: lng, display_name: address, label }))
        onOpenChange(false)
      },
      (err) => alert(err?.message || "Unable to get your location."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, [onOpenChange, onPick])

  const onSelectPlace = useCallback(
    (item: any) => {
      onPick(toPicked(item))
      onOpenChange(false)
    },
    [onOpenChange, onPick],
  )

  const onSelectPopular = useCallback(
    async (name: string) => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kw&q=${encodeURIComponent(
            name,
          )}`,
          { headers: { "Accept-Language": "en" } },
        )
        const [item] = await res.json()
        if (item) onSelectPlace(item)
      } finally {
        setLoading(false)
      }
    },
    [onSelectPlace],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Send location</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(q)}
              placeholder="Search a place in Kuwait..."
              className="pl-8"
              aria-label="Search location"
            />
          </div>
          <Button
            type="button"
            onClick={() => search(q)}
            disabled={!q.trim() || loading}
            style={{
              background: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
              color: "var(--color-primary-foreground)",
            }}
            className="rounded-full"
          >
            Search
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full bg-transparent"
            onClick={useCurrent}
            disabled={loading}
            aria-label="Use current location"
          >
            <LocateFixed className="size-4 mr-2" />
            Use current location
          </Button>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Popular in Kuwait</h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_KW.map((name) => (
              <button
                key={name}
                onClick={() => onSelectPopular(name)}
                className="px-3 h-8 rounded-full border text-sm hover:bg-muted"
                style={{ borderColor: "var(--color-secondary)" }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="max-h-[300px]">
          <ul className="mt-2 space-y-2">
            {results.map((item) => (
              <li key={item.place_id}>
                <button className="w-full text-left p-2 rounded-md hover:bg-muted" onClick={() => onSelectPlace(item)}>
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 mt-1" style={{ color: "var(--color-secondary)" }} />
                    <div>
                      <div className="text-sm font-medium">{item.display_name?.split(",")[0]}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{item.display_name}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
            {!loading && results.length === 0 && q && (
              <li className="text-sm text-muted-foreground px-2">No results</li>
            )}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function toPicked(item: any): PickedLocation {
  const lat = item.lat !== undefined
    ? +(+item.lat).toFixed?.(6)
    : item.latitude !== undefined
    ? +(+item.latitude).toFixed?.(6)
    : 0
  const lngVal = item.lon !== undefined
    ? +(+item.lon).toFixed?.(6)
    : item.longitude !== undefined
    ? +(+item.longitude).toFixed?.(6)
    : 0
  const lng = +lngVal
  const label = item.label || item.display_name?.split(",")[0]
  const address = item.display_name
  const mapImageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=14&size=600x300&markers=${lat},${lng},lightred-pushpin`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  return { lat, lng, label, address, mapImageUrl, mapsLink }
}
