"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({
  url,
  size = 200,
  className = "",
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      try {
        setIsGenerating(true);
        setError(null);

        await QRCode.toCanvas(canvasRef.current, url, {
          width: size,
          height: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H", // High error correction
        });
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [url, size]);

  const downloadQRCode = () => {
    if (!canvasRef.current) return;

    try {
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error downloading QR code:", err);
    }
  };

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50 ${className}`}
      >
        <div className="text-red-500 text-sm text-center">
          <p>❌ {error}</p>
          <p className="mt-2 text-xs">Please try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-lg shadow-lg"
          style={{
            width: size,
            height: size,
          }}
        />
      </div>

      {/* Download Button */}
      {!isGenerating && (
        <button
          onClick={downloadQRCode}
          className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download QR Code
        </button>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center max-w-[200px]">
        Scan this QR code to view this place on your mobile device
      </p>
    </div>
  );
}
