"use client"

import { Facebook, Instagram, ExternalLink, LinkIcon } from "lucide-react"
import { Input } from "@/components/common/input"

export function IconLink({
  platform,
  icon,
  ...rest
}: {
  platform?: "facebook" | "instagram"
  icon?: "external-link"
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
}) {
  const Icon =
    platform === "facebook" ? Facebook : platform === "instagram" ? Instagram : icon ? ExternalLink : LinkIcon
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary]">
        <Icon className="h-5 w-5" />
      </div>
      <Input className="pl-11" {...rest} />
    </div>
  )
}
