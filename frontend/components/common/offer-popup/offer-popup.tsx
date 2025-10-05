"use client"

import { useEffect, useId, useState } from "react"
import { SpinWheel } from "./spin-wheel"
import { cn } from "@/lib/utils"
import QR from "qrcode"
import { Button } from "../button"

type OfferPopupProps = {
  open: boolean
  onClose: () => void
}

type Step = "offer" | "spin" | "qr"

export function PopupSection({ open, onClose }: OfferPopupProps) {
  const titleId = useId()
  const [step, setStep] = useState<Step>("offer")

  // Spin step states
  const [spinTrigger, setSpinTrigger] = useState(0)
  const [hasSpun, setHasSpun] = useState(false)
  const [won, setWon] = useState<number | null>(null)

  useEffect(() => {
    if (!open) {
      // reset when closed
      setStep("offer")
      setSpinTrigger(0)
      setHasSpun(false)
      setWon(null)
    }
  }, [open])

  if (!open) return null

  const close = () => onClose?.()

  const onContinue = () => {
    if (step === "offer") {
      setStep("spin")
      return
    }
    if (step === "spin") {
      if (!hasSpun) {
        setSpinTrigger((n) => n + 1) // first Continue spins
        return
      }
      // already spun: move to QR
      setStep("qr")
      return
    }
    if (step === "qr") {
      close()
    }
  }

  const footerLabel = step === "spin" && !hasSpun ? "Continue to Spin" : step === "qr" ? "Close" : "Continue"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 !z-1005 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <section className="relative z-10 w-full max-w-[680px] rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <header className="bg-brand-gradient text-black px-5 py-4 md:py-5 relative">
          <h2 id={titleId} className="text-h6 md:text-h5 text-balance">
            {step === "offer" ? "Claim Offer" : step === "spin" ? "Spin to Win Points!" : "Offer Claimed Successfully!"}
          </h2>
          <button
            aria-label="Close"
  onClick={close} 
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-primary/20 hover:bg-primary transition"
          >
            <span className="sr-only">Close</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="px-4 md:px-6 py-5 md:py-6">
          <div className="min-h-[360px] md:min-h-[420px] flex flex-col">
            {step === "offer" && <OfferDetails />}

            {step === "spin" && (
              <div className="flex-1 grid place-items-center">
                <SpinStep
                  spinTrigger={spinTrigger}
                  hasSpun={hasSpun}
                  won={won}
                  onFinish={(v) => {
                    setHasSpun(true)
                    setWon(v)
                  }}
                />
              </div>
            )}

            {step === "qr" && (
              <div className="flex-1">
                <QrStep />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 md:px-6 pb-5">
          <Button
          variant={"primary"}
            onClick={onContinue}
            className={cn(
              "w-full rounded-full px-5 py-3 text-normal-semibold",
              "flex items-center justify-center gap-2",
            )}
          >
            <span>{footerLabel}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Button>
        </footer>
      </section>
    </div>
  )
}

function OfferDetails() {
  return (
    <div className="grid gap-4">
      {/* Offer summary card */}
      <div className="rounded-xl border border-border bg-white p-4 md:p-4">
        {/* Top row: thumbnail + details + price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: thumbnail + title */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <span className="absolute -top-2 -left-2 rounded-full bg-secondary text-white text-[11px] px-2 py-1">
                60% OFF
              </span>
              <img
                src="/placeholder-user.jpg"
                alt="Restaurant"
                className="size-14 rounded-full object-cover border border-border"
              />
            </div>
            <div>
              <div className="text-normal-bold">Traditional Kuwaiti Feast</div>
              <div className="text-sm text-gray-600">Al Boom Restaurant</div>
            </div>
          </div>
          {/* Right: price */}
          <div className="text-right">
            <div className="text-sm text-gray-500 line-through">120 KD</div>
            <div className="text-h6 text-secondary">48 KD</div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-border" />

        {/* Validity row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 text-sm text-gray-700">
          <div className="inline-flex items-center gap-2">
            {/* calendar icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" />
              <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            Valid Until December 31, 2024
          </div>
          <div className="inline-flex items-center gap-2">
            {/* clock icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M12 7v6l4 2" stroke="currentColor" />
            </svg>
            12:00 PM - 10:00 PM
          </div>
        </div>

        {/* Business information */}
        <div className="mt-3 rounded-lg border border-border bg-muted p-3 grid gap-2.5">
          {/* phone, address, website */}
          <div className="inline-flex items-center gap-2 text-sm">
            {/* phone icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none">
              <path
                d="M22 16.92V20a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.49 19.49 0 0 1 3.07 12 19.86 19.86 0 0 1 0 3.82 2 2 0 0 1 2 2h3.09a2 2 0 0 1 2 1.72c.12.89.32 1.76.61 2.6a2 2 0 0 1-.45 2.11L6.13 9.91a16 16 0 0 0 8 8l1.47-1.12a2 2 0 0 1 2.11-.45c.84.29 1.71.49 2.6.61A2 2 0 0 1 22 16.92Z"
                stroke="currentColor"
              />
            </svg>
            +965 2222 3333
          </div>
          <div className="inline-flex items-center gap-2 text-sm">
            {/* location icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s-7-4.35-7-10a7 7 0 1 1 14 0c0 5.65-7 10-7 10Zm9-9v18" stroke="currentColor" />
              <path d="M3.5 8h17M3.5 16h17" stroke="currentColor" />
            </svg>
            Gulf Road, Kuwait City, Kuwait
          </div>
          <div className="inline-flex items-center gap-2 text-sm">
            {/* link icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12Zm9-9v18" stroke="currentColor" />
              <path d="M3.5 8h17M3.5 16h17" stroke="currentColor" />
            </svg>
            <a
              className="text-secondary underline underline-offset-4"
              href="https://www.alboom-restaurant.com"
              target="_blank"
              rel="noreferrer"
            >
              www.alboom-restaurant.com
            </a>
          </div>
        </div>

        {/* Terms + notifications */}
        <div className="mt-3 grid gap-2.5 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" defaultChecked className="mt-1 size-4 rounded" aria-label="Agree to terms" />
            <span>I agree to the terms and conditions of this offer</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 size-4 rounded" aria-label="Receive offer notifications" />
            <span>Send me notifications about similar offers and exclusive deals</span>
          </label>
        </div>
      </div>

      <div className="text-sm text-gray-600">Review the offer details and tap Continue to proceed to the spin.</div>
    </div>
  )
}

function SpinStep({
  spinTrigger,
  hasSpun,
  won,
  onFinish,
}: {
  spinTrigger: number
  hasSpun: boolean
  won: number | null
  onFinish: (value: number) => void
}) {
  return (
    <div className="grid place-items-center gap-4">
      <p className="text-normal-regular text-center text-gray-700 max-w-[38ch]">
        Spin the wheel to earn bonus loyalty points.
      </p>

      <SpinWheel triggerSpin={spinTrigger} onFinish={onFinish} className="my-1" />

      <p className="text-sm text-gray-500 text-center">
        * One spin per claimed offer. Points will be added to your wallet.
      </p>

      {hasSpun && (
        <div className="rounded-full bg-white text-primary px-4 py-2 border border-border">
          You won <span className="text-medium-bold text-secondary">{won} loyalty points!</span>
        </div>
      )}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Property%201%3DSpin-Prompt-zOL64DcvpygZdNJfTmyYkrnYFd9xKj.png"
        alt="Spin to win reference"
        className="hidden md:block w-0 h-0 opacity-0"
      />
    </div>
  )
}

function QrStep() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // Demo code/value the QR encodes
  const offerCode = "OFFER-ABCD-9876"
  const qrPayload = JSON.stringify({ type: "offer", code: offerCode })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const url = await QR.toDataURL(qrPayload, { margin: 2, width: 256 })
      if (mounted) setQrDataUrl(url)
    })()
    return () => {
      mounted = false
    }
  }, [qrPayload])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offerCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const handleShare = async () => {
    const shareText = `Offer code: ${offerCode}`
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({ title: "Offer Code", text: shareText })
      } catch {}
    } else {
      await handleCopy()
    }
  }

  return (
    <div className="grid gap-2">
      {/* Success check + message */}
      <div className="grid place-items-center -mt-6">
        <div className="rounded-full bg-green-500/10 p-3">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path d="M20 7L9 18l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-center text-gray-700 mt-2">Your offer has been claimed successfully!</p>
      </div>

      {/* QR area */}
      <div className="rounded-xl border border-border bg-muted p-4 md:p-4 grid gap-3 place-items-center">
        <div className="rounded-lg bg-white p-3 max-w-full">
          {qrDataUrl ? (
            <img
              src={qrDataUrl || "/placeholder.svg"}
              alt="QR to redeem the offer"
              className="h-auto max-w-full"
              style={{ width: "clamp(80px, 35vw, 150px)" }}
            />
          ) : (
            <div
              className="aspect-square grid place-items-center text-sm text-gray-500"
              style={{ width: "clamp(80px, 35vw, 150px)" }}
            >
              Generating QR…
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Scan this QR code at the business to redeem your offer. You can always view the code later at Profile {">"} My
          Wallet.
        </p>
      </div>

      {/* Offer code row */}
      <div className="rounded-xl border border-grey bg-primary/5 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-700">Offer Code:</div>
          <button
            onClick={handleCopy}
            className="text-sm text-secondary underline underline-offset-4"
            aria-label="Copy offer code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <input
            type={showCode ? "text" : "password"}
            value={offerCode}
            readOnly
            className="w-full bg-transparent outline-none text-center tracking-wider"
            aria-label="Offer code"
          />
          <button
            onClick={() => setShowCode((s) => !s)}
            className="text-sm text-gray-600"
            aria-label={showCode ? "Hide code" : "Show code"}
          >
            {showCode ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Note: Keep your code safe, as it is a one-time code and will expire with use.
        </p>
      </div>

      {/* Share */}
      <button
        onClick={handleShare}
        className="mx-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-border bg-white text-primary hover:bg-muted"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke="currentColor" />
          <path d="M12 3v14M12 3l5 5M12 3L7 8" stroke="currentColor" />
        </svg>
        Share Code
      </button>
    </div>
  )
}

export default function OfferPopup() {
  const [open, setOpen] = useState(true)
  return (
    <div className="w-full flex items-center justify-center ">
      <PopupSection open={open}  onClose={() => setOpen(false)} />
    </div>
  )
}

