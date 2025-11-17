"use client";

import { useState, useEffect } from "react";
import { X, Copy, Eye, Share2, Download } from "lucide-react";
import QR from "qrcode";
import { Button } from "./button";

interface ClaimQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
}

export default function ClaimQRModal({
  isOpen,
  onClose,
  offer,
}: ClaimQRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  // Use the actual claim code from backend response
  const offerCode = offer?.claimCode || "OFFER-CODE-NOT-FOUND";
  const qrPayload = JSON.stringify({
    type: "offer",
    code: offerCode,
    offerId: offer?.offerId?._id,
    claimId: offer?._id,
  });

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setQrLoading(true);

    (async () => {
      try {
        const url = await QR.toDataURL(qrPayload, {
          margin: 2,
          width: 200,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        if (mounted) {
          setQrDataUrl(url);
          setQrLoading(false);
        }
      } catch (error) {
        console.error("QR generation error:", error);
        if (mounted) setQrLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [qrPayload, isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offerCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `offer-qr-${offerCode}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareText = `Offer code: ${offerCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Offer Code",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md mx-auto relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-sm border border-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="grid gap-4">
            {/* Success check + message */}
            <div className="grid place-items-center">
              <div className="rounded-full bg-green-500/10 p-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                >
                  <path
                    d="M20 7L9 18l-5-5"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-center text-gray-700 mt-2 text-lg font-semibold">
                Offer Claimed Successfully!
              </p>
              <p className="text-center text-gray-600 text-sm mt-1">
                Your offer code is ready to use
              </p>
            </div>

            {/* QR area - Fixed height container */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 grid gap-4 place-items-center">
              <div className="rounded-lg bg-white p-4 shadow-sm grid place-items-center">
                {qrLoading ? (
                  <div className="w-[200px] h-[200px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">
                        Generating QR...
                      </span>
                    </div>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for offer ${offerCode}`}
                    className="w-[200px] h-[200px]"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-sm text-gray-500">
                    Failed to generate QR
                  </div>
                )}
              </div>

              {/* Download QR Button */}
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="rounded-full w-full"
                disabled={!qrDataUrl || qrLoading}
              >
                {qrLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-2"
                  >
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="7,10 12,15 17,10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="12"
                      y1="15"
                      x2="12"
                      y2="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                {qrLoading ? "Generating..." : "Download QR Code"}
              </Button>

              <p className="text-sm text-gray-600 text-center max-w-[300px]">
                Scan this QR code at the business to redeem your offer. You can
                always view the code later at Profile {">"} My Wallet.
              </p>
            </div>

            {/* Offer code row */}
            <div className="rounded-xl border border-gray-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-sm font-medium text-gray-700">
                  Your Offer Code:
                </div>
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 underline underline-offset-4 hover:text-blue-800 disabled:opacity-50"
                  aria-label="Copy offer code"
                  disabled={!offerCode}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3">
                <input
                  type={showCode ? "text" : "password"}
                  value={offerCode}
                  readOnly
                  className="w-full bg-transparent outline-none text-center tracking-wider font-mono text-lg"
                  aria-label="Offer code"
                />
                <button
                  onClick={() => setShowCode((s) => !s)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                  aria-label={showCode ? "Hide code" : "Show code"}
                >
                  {showCode ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <strong>Note:</strong> Keep your code safe, as it is a one-time
                code and will expire after use. Code expires on{" "}
                {offer?.offerId?.expiryDate
                  ? new Date(offer.offerId.expiryDate).toLocaleDateString()
                  : "the offer expiry date"}
                .
              </p>
            </div>

            {/* Share Button */}
            <div className="text-center">
              <Button
                onClick={handleShare}
                variant="outline"
                className="rounded-full w-full"
                disabled={!offerCode}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-2"
                >
                  <path
                    d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="16,6 12,2 8,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Share Offer Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
