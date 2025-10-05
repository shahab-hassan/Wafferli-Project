"use client"

import type { ReactNode } from "react"

export function TextCounter({
  value,
  max,
  className,
  children,
}: {
  value: string
  max: number
  className?: string
  children: ReactNode
}) {
  const count = value.length
  return (
    <div className={className}>
      {children}
      <div className="mt-1 text-right text-xs text-[color-mix(in oklab, primary 55%, white)]">
        {count}/{max}
      </div>
    </div>
  )
}
