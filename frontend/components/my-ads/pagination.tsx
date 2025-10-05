"use client"

import { Button } from "@/components/common/button"

export function PaginationBar({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        className="rounded-full shrink-0"
      >
        Prev
      </Button>
      <div className="flex items-center gap-2 overflow-x-auto px-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              "grid h-9 w-9 place-items-center rounded-full border text-sm shrink-0",
              p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="rounded-full shrink-0"
      >
        Next
      </Button>
    </div>
  )
}
