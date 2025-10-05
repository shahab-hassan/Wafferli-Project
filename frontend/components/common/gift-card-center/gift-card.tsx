"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Gift, Mail, Copy, Eye, QrCode, Share2, MapPin, Phone, Globe, X } from "lucide-react"
import Image from "next/image"

type ScratchState = "congratulations" | "scratching" | "opened"

export default function GiftCardCenter() {
  const t = useTranslations("giftCards")

  const [showScratchModal, setShowScratchModal] = useState(false)
  const [scratchState, setScratchState] = useState<ScratchState>("congratulations")
  const [showDiscountCode, setShowDiscountCode] = useState(false)
  const [giftPoints, setGiftPoints] = useState("10")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [copied, setCopied] = useState(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [wonDiscountIndex, setWonDiscountIndex] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)

  const giftCards = [
    { type: "scratch", title: t("scratchCard"), status: "claim", img: "/ScratchCard.png" },
    { type: "reward", title: t("dailyReward"), status: "claim", icon: <Gift /> },
    { type: "loyalty", title: `15 ${t("loyaltyPoints")}`, status: "claimed", icon: <Gift /> },
    { type: "loyalty", title: `25 ${t("loyaltyPoints")}`, status: "claimed", icon: <Gift /> },
    { type: "scratch", title: t("scratchCard"), status: "claimed", img: "/ScratchCard.png" },
  ]

  const discounts = [
    {
      title: t("traditionalKuwaitiFeast"),
      vendor: t("alBoomRestaurant"),
      valid: `${t("validUntil")} December 31, 2024`,
      hours: "12:00 PM - 10:00 PM",
      original: "120 KD",
      price: "48 KD",
      code: "ALBOOM60OFF",
      img: "/discount-1.jpg",
      badge: "60% OFF",
    },
    {
      title: "Seafood Platter Deal",
      vendor: "Marina Eats",
      valid: `${t("validUntil")} January 15, 2025`,
      hours: "01:00 PM - 11:00 PM",
      original: "90 KD",
      price: "36 KD",
      code: "MARINA40",
      img: "/discount-2.jpg",
      badge: "40% OFF",
    },
    {
      title: "Family Buffet Offer",
      vendor: "Gulf Banquets",
      valid: `${t("validUntil")} February 10, 2025`,
      hours: "11:00 AM - 10:00 PM",
      original: "150 KD",
      price: "75 KD",
      code: "FAMILY50",
      img: "/discount-3.jpg",
      badge: "50% OFF",
    },
  ]

  const prev = () => setActiveIndex((s) => Math.max(0, s - 1))
  const next = () => setActiveIndex((s) => Math.min(giftCards.length - 1, s + 1))

  const handleScratch = () => {
    const idx = Math.floor(Math.random() * discounts.length)
    setWonDiscountIndex(idx)
    setShowScratchModal(true)
    setScratchState("congratulations")
  }

  const handleScratchNow = () => {
    setScratchState("scratching")
    setTimeout(() => setScratchState("opened"), 1400)
  }

  const copyDiscountCode = async (code = "ALBOOM60OFF") => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  const won = discounts[wonDiscountIndex]

  // close when clicking backdrop (but not when clicking modal content)
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setShowScratchModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes scribble {
          0% { transform: rotate(0deg); opacity: 1; }
          50% { transform: rotate(6deg); opacity: 0.95; }
          100% { transform: rotate(-6deg); opacity: 1; }
        }
        .scribble-anim { animation: scribble 1s linear infinite; transform-origin: center; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t("title")}</h1>

        {/* TOP CAROUSEL */}
        <div className="relative mb-8">
          <button
            onClick={prev}
            aria-label="previous"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 w-9 h-9 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto py-3 px-6 no-scrollbar"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {giftCards.map((card, idx) => {
              const isActive = idx === activeIndex
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    if (cardRefs.current) {
                      cardRefs.current[idx] = el
                    }
                  }}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 w-56 cursor-pointer transition-transform duration-150 ${
                    isActive ? "scale-100" : "scale-95 opacity-95"
                  }`}
                >
                  <div
                    className={`bg-white rounded-xl p-5 h-full ${isActive ? "border-2 border-secondary" : "border border-gray-200"}`}
                  >
                    <div className="mx-auto mb-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/30">
                      {card.type === "scratch" && card.img ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={card.img || "/placeholder.svg"}
                            alt="scratch card"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">{card.title}</h3>

                    <div className="flex justify-center">
                      {card.status === "claim" ? (
                        <button
                          onClick={card.type === "scratch" ? handleScratch : undefined}
                          className="rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white"
                        >
                          {t("claimNow")}
                        </button>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 text-xs rounded-md inline-block">
                          {t("claimed")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={next}
            aria-label="next"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 w-9 h-9 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Discounts (span 2) */}
          <div className="xl:col-span-2 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t("discounts")}</h2>
              <p className="text-sm text-gray-600">{t("fromScratchCards")}</p>
            </div>

            {discounts.map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Fixed aspect ratio image container */}
                  <div className="w-full sm:w-20 aspect-[4/3] rounded-lg flex-shrink-0 bg-gray-50 overflow-hidden">
                    <Image
                      src={d.img || "/placeholder.svg"}
                      alt={d.title}
                      width={80}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <div className="inline-block text-white px-2 py-1 rounded text-xs font-semibold mb-2 bg-gradient-to-r from-primary to-secondary">
                          {d.badge}
                        </div>
                        <h3 className="font-bold text-gray-900">{d.title}</h3>
                        <p className="text-sm text-gray-600">{d.vendor}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs text-gray-400 line-through">{d.original}</div>
                        <div className="text-lg font-bold text-gray-900">{d.price}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
                      <span>📅 {d.valid}</span>
                      <span>🕐 {d.hours}</span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">{t("discountCode")}</p>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary/10 rounded-full px-4 py-2 text-center font-mono text-sm">
                          {showDiscountCode ? d.code : "••••••••••••"}
                        </div>

                        <button
                          onClick={() => copyDiscountCode(d.code)}
                          className="rounded-full border border-gray-200 p-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title={t("copy")}
                          aria-label="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setShowDiscountCode((s) => !s)}
                          className="rounded-full border border-gray-200 p-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title={showDiscountCode ? "Hide" : "Show"}
                          aria-label="Show or hide code"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {copied && <div className="text-xs text-green-600 mt-2">{t("copied")} to clipboard!</div>}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs text-gray-500">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Gulf Road, Kuwait City, Kuwait</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          +965 2222 3333
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">www.alboom-restaurant.com</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="rounded-full border border-gray-200 px-3 py-1 flex items-center gap-2 text-xs hover:bg-gray-50 transition-colors">
                          <QrCode className="w-3 h-3" />
                          <span>{t("qrCode")}</span>
                        </button>
                        <button className="rounded-full border border-gray-200 px-3 py-1 flex items-center gap-2 text-xs hover:bg-gray-50 transition-colors">
                          <Share2 className="w-3 h-3" />
                          <span>{t("share")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Gift Points */}
          <div className="xl:col-span-1">
            <div className="rounded-xl p-6 border border-gray-200 bg-primary/3 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/30">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{t("giftPoints")}</h3>
                <p className="text-gray-600 text-sm">{t("giftLoyaltyPoints")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={giftPoints}
                    onChange={(e) => setGiftPoints(e.target.value)}
                    className="w-full rounded-full px-4 py-3 text-center border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={`10 ${t("points")}`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full rounded-full pl-14 pr-4 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t("recipientEmail")}
                  />
                </div>

                <button className="w-full rounded-full px-4 py-3 font-semibold bg-tertiary text-black hover:bg-tertiary/90 transition-colors">
                  {t("giftPoints")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCRATCH MODAL (very high z-index) */}
      {showScratchModal && (
        <div
          ref={overlayRef}
          onMouseDown={onOverlayClick}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-xl max-w-sm w-full mx-4 border border-gray-200">
            <div className="relative">
              <div className="text-white text-center rounded-t-xl bg-gradient-to-r from-primary to-secondary pt-3 pb-3">
                {scratchState !== "opened" ? (
                  <>
                    <div className="text-xs leading-none">{t("congratulations")}</div>
                    <div className="font-semibold text-sm mt-1">{t("youWonScratchCard")}</div>
                  </>
                ) : (
                  <div className="font-semibold text-sm">{t("scratchCardOpened")}</div>
                )}
              </div>

              <button
                onClick={() => setShowScratchModal(false)}
                aria-label="Close scratch modal"
                title="Close"
                className="absolute -right-3 -top-3 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white border border-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6">
              {scratchState === "congratulations" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 w-36 h-28 flex items-center justify-center rounded-lg bg-primary/10">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <div style={{ transform: "rotate(-12deg)" }} className="w-16 h-16">
                        <Image src="/ScratchCard.png" alt="scratch" width={64} height={64} className="object-contain" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleScratchNow}
                    className="w-full max-w-[200px] mx-auto block rounded-full px-6 py-3 bg-tertiary text-black font-semibold"
                  >
                    {t("scratchNow")}
                  </button>
                </div>
              )}

              {scratchState === "scratching" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 w-36 h-28 flex items-center justify-center rounded-lg bg-primary/10 relative">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                      <div style={{ transform: "rotate(-12deg)" }} className="w-16 h-16">
                        <Image src="/ScratchCard.png" alt="scratch" width={64} height={64} className="object-contain" />
                      </div>

                      <svg
                        className="absolute inset-0 w-full h-full scribble-anim"
                        viewBox="0 0 120 120"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <path
                          d="M12 32 C40 4, 80 64, 108 34"
                          stroke="white"
                          strokeWidth="12"
                          strokeLinecap="round"
                          fill="none"
                          opacity="0.95"
                        />
                        <path
                          d="M12 78 C40 46, 80 116, 108 78"
                          stroke="white"
                          strokeWidth="12"
                          strokeLinecap="round"
                          fill="none"
                          opacity="0.95"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mx-auto inline-block">
                    <div className="rounded-full bg-white text-gray-700 px-5 py-2 border border-gray-200 text-sm">
                      {t("scratching")}
                    </div>
                  </div>
                </div>
              )}

              {scratchState === "opened" && (
                <div className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-left mb-4">
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                          <Image
                            src={won.img || "/placeholder.svg"}
                            alt={won.vendor}
                            width={48}
                            height={48}
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-primary to-secondary text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          {won.badge}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{won.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{won.vendor}</div>
                        <div className="text-xs text-gray-400 mt-1">{won.valid}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-left mb-4">
                    <label className="text-xs text-gray-600 block mb-2">{t("discountCode")}</label>
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-full bg-gray-50 px-4 py-2 font-mono text-sm border border-gray-200"
                        readOnly
                        value={won.code}
                      />
                      <button
                        onClick={() => copyDiscountCode(won.code)}
                        className="rounded-full border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && <div className="text-xs text-green-600 mt-2">{t("copied")}!</div>}
                  </div>

                  <div className="text-xs text-gray-500 mb-4 text-center">{t("keepCodeSafe")}</div>

                  <button className="rounded-full w-full border border-gray-200 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>{t("shareCode")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}