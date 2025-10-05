"use client"

import MessageBubble from "./message-bubble"
import LocationCard from "./location-card"
import type { ChatMessage } from "../../types/chat"

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="mx-auto w-full max-w-[1220px] mb-30 mt-10">
      {messages.map((m) => {
        const align = m.author === "me" ? "right" : "left"
        if (m.type === "location") {
          return (
            <MessageBubble key={m.id} message={m} align={align}>
              <LocationCard
                mapImageUrl={m.location.mapImageUrl}
                label={m.location.label}
                address={m.location.address}
                mapsLink={m.location.mapsLink}
              />
            </MessageBubble>
          )
        }
        return <MessageBubble key={m.id} message={m} align={align} />
      })}
    </div>
  )
}
