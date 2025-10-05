"use client"
import type * as React from "react"
import { cn } from "@/lib/utils"

type PageContainerProps = React.PropsWithChildren<{ className?: string }>

export function PageContainer({ className, children }: PageContainerProps) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-6 md:py-10", className)}>{children}</div>
}
