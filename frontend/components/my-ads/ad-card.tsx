"use client"

import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { cn } from "@/lib/utils"
import { PencilLine, PlayCircle, PauseCircle, Trash2, Info, Link } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/common/alert-dialog"

export type AdStatus = "active" | "inactive" | "pending" | "rejected"
export type AdLabel = "featured" | "sponsored"

export type AdCardProps = {
  id: string
  title: string
  subtitle: string
  inStock: boolean
  price: number
  crossedPrice?: number
  badges: string[]
  status: AdStatus
  labels: AdLabel[]
  clicks: number
  views: number
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export function AdCard(props: AdCardProps) {
  const {
    id,
    title,
    subtitle,
    inStock,
    price,
    crossedPrice,
    badges,
    status,
    labels,
    clicks,
    views,
    onToggleStatus,
    onDelete,
  } = props

  const statusChip = {
    active: { text: "Active", bg: "var(--success)", fg: "#0f5132" },
    inactive: { text: "Inactive", bg: "var(--secondary)", fg: "#3a0a1b" },
    pending: { text: "Pending", bg: "var(--accent)", fg: "#7a5d00" },
    rejected: { text: "Rejected", bg: "var(--color-destructive)", fg: "#7a1d1d" },
  }[status]

  function labelChip(label: AdLabel) {
    if (label === "featured") return { text: "Featured", bg: "var(--primary)", fg: "white" }
    return { text: "Sponsored", bg: "var(--secondary)", fg: "white" }
  }

  return (
    <Card
      className="overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(118,44,133,0.04), rgba(231,30,134,0.02))" }}
    >
      <CardContent className="p-4">
        <div className="grid items-start gap-4 md:grid-cols-[80px_1fr_auto]">
          {/* Picture */}
          <div className="w-full aspect-[4/3] overflow-hidden rounded-md bg-muted md:size-20 md:aspect-square">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt={`${title} photo`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${statusChip.bg}1a`,
                  color: statusChip.fg,
                  border: `1px solid ${statusChip.bg}`,
                }}
              >
                {statusChip.text}
              </span>
              {labels.map((l) => {
                const chip = labelChip(l)
                return (
                  <span
                    key={l}
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: chip.bg, color: chip.fg }}
                  >
                    {chip.text}
                  </span>
                )
              })}
            </div>

            <div className="space-y-0.5">
              <h3 className="text-balance text-base font-semibold truncate">{title}</h3>
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              <p className="text-sm">{inStock ? "In Stock" : "Out of Stock"}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-semibold">
                {price} KD{" "}
                {crossedPrice ? (
                  <span className="text-sm font-normal text-muted-foreground line-through">{crossedPrice} KD</span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {badges.map((b) => (
                  <Badge key={b} variant="secondary" className="rounded-full">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics and actions */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{clicks} Clicks</span>
                <span
                  className="rounded-full px-2 py-1"
                  style={{ background: "var(--success)1a", color: "var(--success)" }}
                >
                  {views} Views
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 md:justify-end">
                <Link href={`/edit-ad`} >
              <Button variant="secondary" size="sm" className="rounded-full">
                <PencilLine className="mr-1 h-4 w-4" />
                Edit
              </Button>
              </Link>
              <Button
                variant={status === "active" ? "outline" : "default"}
                size="sm"
                className={cn("rounded-full", status !== "active" && "bg-failure text-white hover:bg-failure/90")}
                onClick={() => onToggleStatus(id)}
              >
                {status === "active" ? (
                  <>
                    <PauseCircle className="mr-1 h-4 w-4" />
                    Pause Ad
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-1 h-4 w-4" />
                    Resume Ad
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this ad?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The ad “{title}” will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90 rounded-full"
                      onClick={() => onDelete(id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {status === "rejected" ? (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <Info className="h-4 w-4" />
            This ad was rejected. See details.
            <button className="ml-auto text-sm font-medium underline underline-offset-2">See Details</button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
