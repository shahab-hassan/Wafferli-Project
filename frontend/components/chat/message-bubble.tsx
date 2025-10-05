"use client"

import type React from "react"

import { Avatar, AvatarFallback } from "@/components/common/avatar"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../../types/chat"

export default function MessageBubble({
  message,
  align = "left",
  children,
}: {
  message: ChatMessage
  align?: "left" | "right"
  children?: React.ReactNode
}) {
  const isRight = align === "right"
  const bubble =
    message.type === "text" ? (
      <div
        className={cn(
          "inline-block rounded-xl px-4 py-2 text-sm leading-6 bg-muted",
          "max-w-[90vw] sm:max-w-[560px] md:max-w-[620px] break-words",
          isRight && "bg-primary text-white",
        )}
      >
        {message.type === "text" && message.text}
      </div>
    ) : (
      children
    )

  return (
    <div className={cn("flex items-end gap-3 mb-5", isRight && "justify-end")}>
      {!isRight && (
        <Avatar className="size-8 ring-1" style={{ ringColor: "var(--color-primary)" }}>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      {bubble}
      {isRight && (
        <Avatar className="size-8 ring-1" style={{ ringColor: "var(--color-primary)" }}>
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
