"use client"

import { useCallback, useState } from "react"
import { MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/common/button"
import { Textarea } from "@/components/common/textarea"
import LocationPicker, { type PickedLocation } from "@/components/chat/location-picker"

type Props = {
  onSendText: (text: string) => void
  onSendLocation: (payload: {
    lat: number
    lng: number
    label?: string
    address?: string
    mapImageUrl: string
    mapsLink: string
  }) => void
}

export default function MessageInput({ onSendText, onSendLocation }: Props) {
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState<"send" | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const canSend = value.trim().length > 0 && busy === null

  const handleSend = useCallback(() => {
    if (!canSend) return
    setBusy("send")
    onSendText(value.trim())
    setValue("")
    setBusy(null)
  }, [canSend, onSendText, value])

  const handlePick = useCallback(
    (p: PickedLocation) => {
      onSendLocation(p)
    },
    [onSendLocation],
  )

  return (
    <>
      <div className="w-full p-3 md:p-4 bg-white">
        <div className="flex items-end gap-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a message..."
            className="min-h-[44px] max-h-40 resize-y rounded-full"
            rows={2}
            aria-label="Message"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPickerOpen(true)}
              aria-label="Choose location"
              className="h-10 w-10 rounded-full bg-transparent"
              title="Send a location"
              style={{ borderColor: "var(--color-secondary)", color: "var(--color-secondary)" }}
            >
              <MapPin className="size-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              className="h-10 rounded-full px-5 text-white"
              style={{
                background: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
              }}
            >
              {busy === "send" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden md:inline">Send</span>
                  <Send className="size-4 md:ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <LocationPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={handlePick} />
    </>
  )
}
