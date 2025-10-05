"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { Copy, Eye, MapPin, Phone, Globe, Search, Share2, QrCode, X, Gift } from "lucide-react"
import ClaimQRModal from "@/components/common/claim-qr-modal"
import Image from "next/image"

type SpinState = "congratulations" | "spinning" | "opened"

export default function MyWalletPage() {
  const t = useTranslations("wallet")

  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showCodes, setShowCodes] = useState({})
  const [copiedReferral, setCopiedReferral] = useState(false)

  const [showSpinModal, setShowSpinModal] = useState(false)
  const [spinState, setSpinState] = useState<SpinState>("congratulations")
  const [wonDiscountIndex, setWonDiscountIndex] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [copiedDiscount, setCopiedDiscount] = useState(false)

  const discounts = [
    {
      title: t("traditionalKuwaitiFeast"),
      vendor: t("alBoomRestaurant"),
      valid: `${t("validUntil")} December 31, 2024`,
      hours: "12:00 PM - 10:00 PM",
      original: "120 KD",
      price: "48 KD",
      code: "************",
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
      code: "************",
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
      code: "************",
      img: "/discount-3.jpg",
      badge: "50% OFF",
    },
  ]

  const claimedOffers = [
    {
      id: 1,
      title: t("traditionalKuwaitiFeast"),
      vendor: t("alBoomRestaurant"),
      badge: "60% OFF",
      validUntil: t("validUntil") + " December 31, 2024",
      hours: "12:00 PM - 10:00 PM",
      originalPrice: "120 KD",
      discountedPrice: "48 KD",
      code: "************",
      address: "Gulf Road, Kuwait City, Kuwait",
      phone: "+965 2222 3333",
      website: "www.alboom-restaurant.com",
      status: "active",
      hasSpin: true,
    },
    {
      id: 2,
      title: t("traditionalKuwaitiFeast"),
      vendor: t("alBoomRestaurant"),
      badge: "60% OFF",
      validUntil: t("validUntil") + " December 31, 2024",
      hours: "12:00 PM - 10:00 PM",
      originalPrice: "120 KD",
      discountedPrice: "48 KD",
      code: "************",
      address: "Gulf Road, Kuwait City, Kuwait",
      phone: "+965 2222 3333",
      website: "www.alboom-restaurant.com",
      status: "used",
      claimedDate: "Claimed December 31, 2024",
      hasSpin: false,
    },
    {
      id: 3,
      title: t("traditionalKuwaitiFeast"),
      vendor: t("alBoomRestaurant"),
      badge: "60% OFF",
      validUntil: t("validUntil") + " December 31, 2024",
      hours: "12:00 PM - 10:00 PM",
      originalPrice: "120 KD",
      discountedPrice: "48 KD",
      code: "************",
      address: "Gulf Road, Kuwait City, Kuwait",
      phone: "+965 2222 3333",
      website: "www.alboom-restaurant.com",
      status: "used",
      claimedDate: "Claimed December 31, 2024",
      hasSpin: false,
    },
  ]

  const handleShowQR = (offer) => {
    setSelectedOffer(offer)
    setShowQRModal(true)
  }

  const toggleCode = (id) => {
    setShowCodes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText("WAFFERLI2024")
      setCopiedReferral(true)
      setTimeout(() => setCopiedReferral(false), 1200)
    } catch {
      // ignore
    }
  }

  const handleSpin = () => {
    const idx = Math.floor(Math.random() * discounts.length)
    setWonDiscountIndex(idx)
    setShowSpinModal(true)
    setSpinState("congratulations")
  }

  const handleSpinNow = () => {
    setSpinState("spinning")
    setTimeout(() => setSpinState("opened"), 1400)
  }

  const copyDiscountCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedDiscount(true)
      setTimeout(() => setCopiedDiscount(false), 1200)
    } catch {
      // ignore
    }
  }

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setShowSpinModal(false)
  }

  const won = discounts[wonDiscountIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t("myWallet")}</h1>

        {/* Loyalty Points Bar */}
        <div className="flex flex-col lg:flex-row gap-2 mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-4 flex items-center justify-between flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                ⭐
              </div>
              <div>
                <div className="font-semibold">{t("loyaltyPoints")}</div>
                <div className="text-xs opacity-80">{t("yourLoyaltyBalance")}</div>
              </div>
            </div>
            <div className="text-2xl font-bold">1,250 points</div>
          </div>
          <div className="bg-gray-500 text-white rounded-xl p-4 flex items-center justify-between flex-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center text-white">👑</div>
              <span>{t("silverMember")}</span>
            </div>
            <div className="flex-1 mx-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "75%" }}></div>
            </div>
            <span className="text-sm opacity-80">750 points to Gold</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{t("myClaimedOffers")}</h2>
              <span className="text-sm text-gray-500">3 {t("offers")}</span>
            </div>
            <input
              type="text"
              placeholder={t("searchByOfferTitle")}
              className="w-full rounded-xl px-4 py-3 mb-4 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="text-gray-600 font-medium">{t("viewAll")} (0)</button>
              <button className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">{t("active")} (1)</button>
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{t("used")} (1)</button>
            </div>

            {claimedOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl p-4 border border-gray-200 mb-4 relative">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0" /> {/* Placeholder image */}
                  <div className="flex-1">
                    <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded text-xs font-semibold mb-1">
                      {offer.badge}
                    </div>
                    <h3 className="font-bold text-gray-900">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.vendor}</p>
                    {offer.claimedDate && <p className="text-xs text-gray-500">{offer.claimedDate}</p>}
                    <p className="text-xs text-gray-500">{offer.validUntil} ○ {offer.hours}</p>
                  </div>
                  <div className="text-right flex-shrink-0 w-full sm:w-auto">
                    <p className="text-sm text-gray-400 line-through">{offer.originalPrice}</p>
                    <p className="text-lg font-bold text-gray-900">{offer.discountedPrice}</p>
                    {offer.hasSpin && (
                      <button onClick={handleSpin} className="mt-2 rounded-full px-4 py-2 text-sm font-semibold bg-tertiary text-black block ml-auto w-full sm:w-auto">
                        ⚡ {t("spinToWin")}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-600 block mb-1">{t("offerCode")}:</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary/10 rounded-full px-4 py-2 relative">
                      <input
                        type={showCodes[offer.id] ? "text" : "password"}
                        value={offer.code}
                        readOnly
                        className="w-full bg-transparent border-none focus:outline-none text-sm font-mono pr-8"
                      />
                      <button onClick={() => toggleCode(offer.id)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => copyDiscountCode(offer.code)} className="text-primary flex items-center gap-1 whitespace-nowrap">
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                  {copiedDiscount && <div className="text-xs text-green-600 mt-2">{t("copied")}</div>}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-primary flex-wrap">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {offer.address}
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    {offer.phone}
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    {offer.website}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-end gap-4 text-sm text-gray-600">
                  <button onClick={() => handleShowQR(offer)} className="flex items-center gap-1 hover:text-primary rounded-full bg-gray-50 px-3 py-1 border border-gray-200">
                    <QrCode className="w-4 h-4" />
                    {t("qrCode")}
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary rounded-full bg-gray-50 px-3 py-1 border border-gray-200">
                    <Share2 className="w-4 h-4" />
                    {t("share")}
                  </button>
                </div>
                {offer.status === "active" && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                    {t("active")}
                  </span>
                )}
                {offer.status === "used" && (
                  <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                    {t("used")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  👥
                </div>
                <h3 className="font-bold text-gray-900">{t("inviteFriends")}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{t("earn100Points")}</p>
              <div className="bg-gray-50 rounded-full px-4 py-2 flex justify-between items-center">
                <span className="text-gray-800">WAFFERLI2024</span>
                <button onClick={copyReferral} className="text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedReferral && <p className="text-xs text-green-600 mt-2">{t("copied")}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("loyaltyTiers")}</h3>
              <div className="space-y-3">
                <div className="bg-orange-500 text-white rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">👑 {t("bronze")}</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• 0 - 500 points</li>
                    <li>• 5% cashback</li>
                    <li>• Basic deals</li>
                  </ul>
                </div>
                <div className="bg-gray-500 text-white rounded-xl p-3 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">👑 {t("silver")}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{t("current")}</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• 501 - 2,000 points</li>
                    <li>• 10% cashback</li>
                    <li>• Exclusive deals</li>
                  </ul>
                </div>
                <div className="bg-yellow-400 text-white rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">👑 {t("gold")}</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li>• 2,001 + points</li>
                    <li>• 20% cashback</li>
                    <li>• Premium perks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPIN MODAL */}
      {showSpinModal && (
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
                {spinState !== "opened" ? (
                  <>
                    <div className="text-xs leading-none">{t("congratulations")}</div>
                    <div className="font-semibold text-sm mt-1">{t("youWonSpin")}</div>
                  </>
                ) : (
                  <div className="font-semibold text-sm">{t("spinCompleted")}</div>
                )}
              </div>

              <button
                onClick={() => setShowSpinModal(false)}
                aria-label="Close spin modal"
                title="Close"
                className="absolute -right-3 -top-3 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white border border-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {spinState === "congratulations" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 w-36 h-28 flex items-center justify-center rounded-lg bg-primary/10">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <div style={{ transform: "rotate(-12deg)" }} className="w-16 h-16">
                        <Image src="/spin-icon.png" alt="spin" width={64} height={64} className="object-contain" /> {/* Assume icon */}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSpinNow}
                    className="w-full max-w-[200px] mx-auto block rounded-full px-6 py-3 bg-tertiary text-black font-semibold"
                  >
                    {t("spinNow")}
                  </button>
                </div>
              )}

              {spinState === "spinning" && (
                <div className="text-center">
                  <div className="mx-auto mb-6 w-36 h-28 flex items-center justify-center rounded-lg bg-primary/10 relative">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                      <div style={{ transform: "rotate(-12deg)" }} className="w-16 h-16 spin-anim">
                        <Image src="/spin-icon.png" alt="spin" width={64} height={64} className="object-contain" /> {/* Assume icon */}
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto inline-block">
                    <div className="rounded-full bg-white text-gray-700 px-5 py-2 border border-gray-200 text-sm">
                      {t("spinning")}
                    </div>
                  </div>
                </div>
              )}

              {spinState === "opened" && (
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
                    {copiedDiscount && <div className="text-xs text-green-600 mt-2">{t("copied")}</div>}
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

      {showQRModal && selectedOffer && (
        <ClaimQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          offer={selectedOffer}
        />
      )}
    </div>
  )
}