"use client";

import { useState } from "react";
import { Share2, Copy, Check, QrCode, X, Download } from "lucide-react";
import { Button } from "@/components/common/button";
import QRCodeGenerator from "./QRCodeGenerator";

interface ShareButtonProps {
  adId: string;
  title?: string;
  className?: string;
}

export default function ShareButton({
  adId,
  title,
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link");

  // Generate shareable link
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/explore/${adId}`;
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generateShareLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share via native share API
  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Check out thi",
          text: title || "Amazing ad",
          url: generateShareLink(),
        });
        setIsOpen(false);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard();
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = generateShareLink();
    const shareText = title || "Check out this amazing ad!";

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
    };

    window.open(
      urls[platform as keyof typeof urls],
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:scale-110 transition-all duration-200 ${className}`}
        title="Share this Ad"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Share this Ad
              </h2>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "link"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("link")}
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share Link
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "qr"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("qr")}
                >
                  <QrCode className="w-4 h-4 inline mr-2" />
                  QR Code
                </button>
              </div>
              {/* Link Tab Content */}
              {activeTab === "link" && (
                <div className="space-y-6">
                  {/* Link Display */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Shareable Link
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-800 break-all flex-1">
                        {generateShareLink()}
                      </p>
                      <Button
                        onClick={copyToClipboard}
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Native Share */}
                  {navigator.share && (
                    <Button
                      onClick={shareViaNative}
                      className="w-full"
                      variant="primary"
                      size="lg"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share via Device
                    </Button>
                  )}
                </div>
              )}
              {/* QR Code Tab Content */}
              {activeTab === "qr" && (
                <div className="text-center">
                  <QRCodeGenerator
                    url={generateShareLink()}
                    size={220}
                    className="mb-6"
                  />

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Shareable Link
                    </p>
                    <p className="text-xs text-gray-700 break-all">
                      {generateShareLink()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
