"use client"
import { useMemo, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/common/avatar"
import { cn } from "@/lib/utils"

type Props = {
  selected: {
    id: string
    name: string
    preview: string
  }
  onSelectChat?: (id: string) => void
}

const conversationsSeed = [
  { id: "c1", name: "Mohid", preview: "Hello, I am interested in...", unread: 0 },
  { id: "c2", name: "Kabli", preview: "Sounds good 👍", unread: 3 },
  { id: "c3", name: "TechZone Kuwait", preview: "Sorry, it's out of stock...", unread: 0 },
]

export default function Sidebar({ selected, onSelectChat }: Props) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const conversations = useMemo(() => {
    if (filter === "unread") return conversationsSeed.filter((c) => c.unread > 0)
    if (filter === "read") return conversationsSeed.filter((c) => c.unread === 0)
    return conversationsSeed
  }, [filter])

  return (
    <div className="h-full flex flex-col">
      <header
        className="px-4 py-4"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          color: "var(--color-white)",
        }}
      >
        <h1 className="text-balance text-lg font-semibold leading-none">Chat</h1>
      </header>

      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterPill label="Unread" active={filter === "unread"} onClick={() => setFilter("unread")} />
          <FilterPill label="Read" active={filter === "read"} onClick={() => setFilter("read")} />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const isActive = c.id === selected.id
          return (
            <button
              key={c.id}
              onClick={() => onSelectChat?.(c.id)}
              className={cn("w-full text-left px-3 py-3 hover:bg-muted/50 border-b", isActive && "bg-muted/60")}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8 ring-2" style={{ ringColor: "var(--color-primary)" }}>
                  <AvatarFallback className="text-xs">{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium leading-5 truncate">{c.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.preview}</p>
                </div>
                {c.unread > 0 && (
                  <span
                    className="ml-auto inline-flex items-center justify-center rounded-full px-2 h-6 text-xs text-white"
                    style={{
                      backgroundColor: "var(--color-primary)",
                    }}
                  >
                    {c.unread}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function FilterPill({
  label,
  active = false,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn("px-3 h-8 rounded-full text-sm border", active ? "text-foreground" : "hover:bg-muted")}
      style={
        active
          ? {
              backgroundColor: "color-mix(in oklab, var(--color-primary) 10%, white)",
              borderColor: "var(--color-primary)",
            }
          : undefined
      }
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
