"use client"

import { useState, useMemo, useCallback } from "react"
import Sidebar from "@/components/chat/sidebar"
import MessageList from "@/components/chat/message-list"
import MessageInput from "@/components/chat/message-input"
import type { ChatMessage } from "@/types/chat"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/common/button"

export default function Page() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>("c1")
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", author: "them", type: "text", text: "Hi 👋", createdAt: new Date() },
    { id: "m2", author: "me", type: "text", text: "Hello.", createdAt: new Date() },
    {
      id: "m3",
      author: "them",
      type: "text",
      text: "I'm interested in the IPhone, is it still available",
      createdAt: new Date(),
    },
    { id: "m4", author: "me", type: "text", text: "Yes, It is.", createdAt: new Date() },
    {
      id: "m5",
      author: "them",
      type: "text",
      text: "I saw you have it listed for 450 KD, is there any leeway possible? Something like 350 KD?",
      createdAt: new Date(),
    },
    { id: "m6", author: "me", type: "text", text: "No, the least I could do is 400 KD.", createdAt: new Date() },
    {
      id: "m7",
      author: "them",
      type: "text",
      text: "Okay, sounds good. The location you have set is 15-20 minutes drive for me. Could we meet in the middle?",
      createdAt: new Date(),
    },
  ])

  const handleSendText = useCallback((text: string) => {
    setMessages((prev) =>
      prev.concat({
        id: crypto.randomUUID(),
        author: "me",
        type: "text",
        text,
        createdAt: new Date(),
      }),
    )
  }, [])

  const handleSendLocation = useCallback(
    (payload: {
      lat: number
      lng: number
      label?: string
      address?: string
      mapImageUrl: string
      mapsLink: string
    }) => {
      setMessages((prev) =>
        prev.concat({
          id: crypto.randomUUID(),
          author: "me",
          type: "location",
          location: payload,
          createdAt: new Date(),
        }),
      )
    },
    [],
  )

  const selected = useMemo(
    () => ({
      id: "c1",
      name: "Mohid",
      preview: "Hello, I am interested in...",
    }),
    [],
  )

  const showChatList = selectedChatId === null
  const showConversation = selectedChatId !== null

  return (
    <main className="min-h-[90dvh] h-[90dvh] md:h-[90vh] w-full overflow-hidden">
      <div className="mx-auto w-full max-w-[1220px] h-full flex">
        <aside className={`w-full md:w-[320px] border-r h-full ${showConversation ? "hidden md:block" : "block"}`}>
          <Sidebar selected={selected} onSelectChat={(id) => setSelectedChatId(id)} />
        </aside>

        <section className={`flex-1 relative h-full ${showChatList ? "hidden md:flex" : "flex"} flex-col`}>
          <div className="md:hidden border-b px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChatId(null)}
              aria-label="Back to chats"
              className="size-8"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h2 className="font-semibold">{selected.name}</h2>
          </div>

          <div className="flex-1 px-4 md:px-8 pt-4 md:pt-6 pb-2 overflow-y-auto">
            <MessageList messages={messages} />
          </div>

          <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <MessageInput onSendText={handleSendText} onSendLocation={handleSendLocation} />
          </div>
        </section>
      </div>
    </main>
  )
}
