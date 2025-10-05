"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  subtitle?: string
  className?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, className, actions }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col items-center justify-between gap-3 text-center md:mb-10 md:flex-row md:text-left",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
