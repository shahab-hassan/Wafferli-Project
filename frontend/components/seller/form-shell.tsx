"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function FormShell({ children, className }: { children: ReactNode; className?: string }) {
  const router = useRouter()
  return (
    <div className={cn("relative", className)}>
      {/* Purple tab back control */}
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="absolute left-6 top-0 z-20 -translate-y-1/2 rounded-t-[12px] bg-[var(--brand-primary)] px-4 py-2 text-white shadow-md ring-1 ring-black/5 hover:opacity-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="rounded-[20px] border border-[var(--brand-border)] bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}
