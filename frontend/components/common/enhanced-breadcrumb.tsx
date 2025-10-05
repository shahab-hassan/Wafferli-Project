"use client"

import * as React from "react"
import { Home } from "lucide-react"
import {cn} from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

export interface BreadcrumbItemData {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface EnhancedBreadcrumbProps {
  items: BreadcrumbItemData[]
  homeIcon?: boolean
  className?: string
}

function useIsRTL() {
  if (typeof document === "undefined") return false
  return document?.documentElement?.dir === "rtl"
}

export function EnhancedBreadcrumb({ items, homeIcon = true, className }: EnhancedBreadcrumbProps) {
  const isRTL = useIsRTL()

  // Reverse items in RTL so order flows right → left
  const orderedItems = isRTL ? [...items].reverse() : items

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {orderedItems.map((item, index) => {
          const isLast = index === orderedItems.length - 1
          const isFirst = index === 0

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-primary font-medium flex items-center">
                    {isFirst && homeIcon && (
                      <Home className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} />
                    )}
                    {item.icon && !isFirst && (
                      <span className={cn(isRTL ? "ml-1" : "mr-1")}>{item.icon}</span>
                    )}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="text-grey-2 hover:text-primary transition-colors flex items-center"
                  >
                    {isFirst && homeIcon && (
                      <Home className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} />
                    )}
                    {item.icon && !isFirst && (
                      <span className={cn(isRTL ? "ml-1" : "mr-1")}>{item.icon}</span>
                    )}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
