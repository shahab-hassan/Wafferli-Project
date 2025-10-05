// components/common/claim-qr-modal.tsx
"use client"

import { useState } from "react"
import { X, Copy, Eye, Share2 } from "lucide-react"

interface ClaimQRModalProps {
  isOpen: boolean
  onClose: () => void
  offer: any
}

export default function ClaimQRModal({ isOpen, onClose, offer }: ClaimQRModalProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyCode = async () => {
    await navigator.clipboard.writeText(offer.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-xl relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white">
            <X className="w-5 h-5" />
          </button>
          <p className="text-center text-sm">Scan QR Code</p>
        </div>
        <div className="p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="w-32 h-32 bg-gray-100 mx-auto mb-2" /> {/* QR placeholder */}
            <p className="text-center text-sm text-gray-600">Scan this QR code at the business to redeem your offer.</p>
          </div>
          <label className="text-sm text-gray-600 block mb-1">Offer Code:</label>
          <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden mb-2">
            <input
              type={showCode ? "text" : "password"}
              value={offer.code}
              readOnly
              className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none"
            />
            <button onClick={() => setShowCode(!showCode)} className="px-3 py-2 text-gray-600">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={copyCode} className="px-3 py-2 text-gray-600 border-l border-gray-200">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-green-600 mb-2">Copied!</p>}
          <p className="text-xs text-gray-500 mb-4">Note: Keep your code safe, as it is a one-time code and will expire with use.</p>
          <button className="w-full bg-gray-100 rounded-full py-2 flex items-center justify-center gap-2 text-gray-800">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}