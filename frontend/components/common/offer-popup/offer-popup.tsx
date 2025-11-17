"use client";

import { useEffect, useId, useState } from "react";
import { SpinWheel } from "./spin-wheel";
import { cn } from "@/lib/utils";
import QR from "qrcode";
import { Button } from "../button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store/store";
import { ClaimOffer } from "@/features/slicer/AdSlice";
import { toast } from "react-hot-toast";
type OfferPopupProps = {
  offer: any;
  open: boolean;
  onClose: () => void;
  onClaimSuccess?: () => void; // NEW: Callback for successful claim
};

type Step = "offer" | "spin" | "qr";

export function PopupSection({
  open,
  onClose,
  offer,
  onClaimSuccess,
}: OfferPopupProps) {
  const titleId = useId();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<Step>("offer");
  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState<any>(null);

  // Spin step states
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [won, setWon] = useState<number | null>(null);

  console.log(offer, "offerinpopus");

  useEffect(() => {
    if (!open) {
      // reset when closed
      setStep("offer");
      setSpinTrigger(0);
      setHasSpun(false);
      setWon(null);
      setClaimData(null);
      setLoading(false);
    }
  }, [open]);

  const close = () => onClose?.();

  const handleClaimOffer = async () => {
    if (!offer?._id) {
      toast.error("Invalid offer data");
      return;
    }

    setLoading(true);
    try {
      const claimPayload = {
        offerId: offer._id,
        termsAndConditions: true,
        notification: false,
        loyaltyPoints: won || 0,
      };

      const response = await dispatch(ClaimOffer(claimPayload) as any);

      if (response.payload?.success) {
        setClaimData(response.payload.data);
        setStep("qr");
        toast.success("Offer claimed successfully!");

        // NEW: Call the success callback to update parent state
        if (onClaimSuccess) {
          onClaimSuccess();
        }
      } else {
        toast.error(response.payload?.message || "Failed to claim offer");
      }
    } catch (error) {
      toast.error("Error claiming offer");
      console.error("Claim offer error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onContinue = () => {
    if (step === "offer") {
      setStep("spin");
      return;
    }
    if (step === "spin") {
      if (!hasSpun) {
        setSpinTrigger((n) => n + 1); // first Continue spins
        return;
      }
      if (hasSpun) {
        handleClaimOffer();
      }
      return;
    }
    if (step === "qr") {
      close();
    }
  };

  const footerLabel =
    step === "offer"
      ? loading
        ? "Claiming..."
        : "Claim Offer"
      : step === "spin" && !hasSpun
      ? "Continue to Spin"
      : step === "spin" && hasSpun && loading
      ? "Claiming..."
      : step === "spin" && hasSpun
      ? "Claim Offer"
      : step === "qr"
      ? "Close"
      : "Continue";

  const isContinueDisabled =
    (step === "spin" && hasSpun && loading) || (step === "offer" && loading);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 !z-1005 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <section className="relative z-10 w-full max-w-[680px] rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <header className="bg-brand-gradient text-black px-5 py-4 md:py-5 relative shrink-0">
          <h2 id={titleId} className="text-h6 md:text-h5 text-balance">
            {step === "offer"
              ? "Claim Offer"
              : step === "spin"
              ? "Spin to Win Points!"
              : "Offer Claimed Successfully!"}
          </h2>
          <button
            aria-label="Close"
            onClick={close}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-primary/20 hover:bg-primary transition"
          >
            <span className="sr-only">Close</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="px-4 md:px-6 py-5 md:py-6 flex-1 overflow-auto">
          <div className="min-h-[280px] flex flex-col">
            {step === "offer" && (
              <OfferDetails offer={offer} loading={loading} />
            )}

            {step === "spin" && (
              <div className="flex-1 grid place-items-center">
                <SpinStep
                  spinTrigger={spinTrigger}
                  hasSpun={hasSpun}
                  won={won}
                  onFinish={(v) => {
                    setHasSpun(true);
                    setWon(v);
                  }}
                />
              </div>
            )}

            {step === "qr" && (
              <div className="flex-1">
                <QrStep claimData={claimData} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 md:px-6 pb-5 shrink-0">
          <Button
            variant={"primary"}
            onClick={onContinue}
            disabled={isContinueDisabled}
            className={cn(
              "w-full rounded-full px-5 py-3 text-normal-semibold",
              "flex items-center justify-center gap-2 text-white",
              isContinueDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <span>{footerLabel}</span>
                {!loading && step !== "qr" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </>
            )}
          </Button>
        </footer>
      </section>
    </div>
  );
}
function OfferDetails({ offer, loading }: { offer: any; loading: boolean }) {
  const [termsCondition, setTermsCondition] = useState(true);
  const [notification, setNotification] = useState(false);

  // Safe avatar calculation
  const getAvatar = () => {
    if (
      offer.sellerDetails?.businessType === "individual" &&
      offer.sellerDetails?.userDetails?.fullName
    ) {
      return offer.sellerDetails.userDetails.fullName.charAt(0).toUpperCase();
    } else if (offer.sellerDetails?.name) {
      return offer.sellerDetails.name.charAt(0).toUpperCase();
    }
    return "S"; // Default if no name found
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get phone number safely
  const getPhoneNumber = () => {
    if (offer.sellerDetails?.userDetails?.phone) {
      return offer.sellerDetails.userDetails.phone;
    } else if (offer.sellerDetails?.phone) {
      return offer.sellerDetails.phone;
    } else if (offer.phone) {
      return offer.phone;
    }
    return "Not available";
  };

  // Get location safely
  const getLocation = () => {
    const city = offer.sellerDetails?.city || offer.city;
    const neighbourhood =
      offer.sellerDetails?.neighbourhood || offer.neighbourhood;

    if (city && neighbourhood) {
      return `${city}, ${neighbourhood}`;
    } else if (city) {
      return city;
    } else if (neighbourhood) {
      return neighbourhood;
    }
    return "Location not specified";
  };

  const avatar = getAvatar();

  return (
    <div className="grid gap-4">
      {/* Offer summary card */}
      <div className="rounded-xl border border-border bg-white p-4 md:p-4">
        {/* Top row: thumbnail + details + price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: thumbnail + title */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              {offer.discountDeal && offer.discountPercent && (
                <span className="absolute -top-2 -left-2 rounded-full bg-secondary text-white text-[11px] px-2 py-1">
                  {offer.discountPercent}% OFF
                </span>
              )}
              <div className="size-14 rounded-full bg-primary text-white flex items-center justify-center border border-border text-lg font-semibold">
                {avatar}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-normal-bold text-foreground">
                {offer.title}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {offer.description}
              </div>
            </div>
          </div>

          {/* Right: price */}
          <div className="text-right">
            {offer.discountDeal && offer.discountedPrice ? (
              <>
                <div className="text-sm text-muted-foreground line-through">
                  {offer.fullPrice} KD
                </div>
                <div className="text-h6 text-secondary font-bold">
                  {offer.discountedPrice} KD
                </div>
              </>
            ) : (
              <div className="text-h6 text-primary font-bold">
                {offer.fullPrice} KD
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-border" />

        {/* Validity row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            {/* Calendar icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              className="text-muted-foreground"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Valid Until {formatDate(offer.expiryDate)}
          </div>
        </div>

        {/* Business information */}
        <div className="mt-3 rounded-lg border border-border bg-muted p-3 grid gap-2.5">
          {/* Phone */}
          <div className="inline-flex items-center gap-2 text-sm text-foreground">
            {/* Phone icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              className="text-muted-foreground"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {getPhoneNumber()}
          </div>

          {/* Location */}
          <div className="inline-flex items-center gap-2 text-sm text-foreground">
            {/* Location icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-muted-foreground"
            >
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="10"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {getLocation()}
          </div>

          {/* Website - Only show if available */}
          {offer.sellerDetails?.website && (
            <div className="inline-flex items-center gap-2 text-sm">
              {/* Link icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="text-muted-foreground"
              >
                <path
                  d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <a
                className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
                href={
                  offer.sellerDetails.website.startsWith("http")
                    ? offer.sellerDetails.website
                    : `https://${offer.sellerDetails.website}`
                }
                target="_blank"
                rel="noreferrer"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Terms + notifications */}
        <div className="mt-3 grid gap-2.5 text-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="mt-1 size-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
              aria-label="Agree to terms"
            />
            <span className="text-foreground">
              I agree to the terms and conditions of this offer
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
              className="mt-1 size-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
              aria-label="Receive offer notifications"
            />
            <span className="text-foreground">
              Send me notifications about similar offers and exclusive deals
            </span>
          </label>
        </div>
      </div>

      {/* Offer Details */}
      {offer.offerDetail && (
        <div className="rounded-xl border border-border bg-white p-4 md:p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Offer Details
          </h3>
          <div className="text-normal-regular text-foreground leading-relaxed">
            {offer.offerDetail}
          </div>
        </div>
      )}

      {/* Seller Information */}
      <div className="rounded-xl border border-border bg-white p-4 md:p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {offer.sellerDetails?.businessType === "individual"
            ? "Seller Information"
            : "Business Information"}
        </h3>
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
              {avatar}
            </div>
            <div>
              <div className="text-normal-bold text-foreground">
                {offer.sellerDetails?.businessType === "individual"
                  ? offer.sellerDetails.userDetails?.fullName
                  : offer.sellerDetails?.name || "Seller"}
              </div>
              <div className="text-sm text-muted-foreground">
                Member since{" "}
                {formatDate(
                  offer.sellerDetails?.stats?.memberSince || offer.createdAt
                )}
              </div>
            </div>
          </div>

          {offer.sellerDetails?.stats && (
            <div className="text-sm text-muted-foreground">
              {offer.sellerDetails.stats.totalAds} ads posted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpinStep({
  spinTrigger,
  hasSpun,
  won,
  onFinish,
}: {
  spinTrigger: number;
  hasSpun: boolean;
  won: number | null;
  onFinish: (value: number) => void;
}) {
  return (
    <div className="grid place-items-center gap-4 w-full">
      <p className="text-normal-regular text-center text-gray-700 max-w-[38ch]">
        Spin the wheel to earn bonus loyalty points.
      </p>

      <SpinWheel
        triggerSpin={spinTrigger}
        onFinish={onFinish}
        className="my-1 max-w-[280px] w-full"
      />

      <p className="text-sm text-gray-500 text-center">
        * One spin per claimed offer. Points will be added to your wallet.
      </p>

      {hasSpun && (
        <div className="rounded-full bg-white text-primary px-4 py-2 border border-border text-center">
          You won{" "}
          <span className="text-medium-bold text-secondary">
            {won} loyalty points!
          </span>
        </div>
      )}
    </div>
  );
}

function QrStep({ claimData }: { claimData: any }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  // Use the actual claim code from backend response
  const offerCode = claimData?.claimCode || "OFFER-CODE-NOT-FOUND";
  const qrPayload = JSON.stringify({
    type: "offer",
    code: offerCode,
    offerId: claimData?.offerId,
    claimId: claimData?.claimId,
  });

  useEffect(() => {
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
  }, [qrPayload]);

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

  return (
    <div className="grid gap-4 h-full">
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
      <div className="rounded-xl border border-border bg-muted p-4 grid gap-4 place-items-center flex-1 min-h-0">
        <div className="rounded-lg bg-white p-4 shadow-sm grid place-items-center">
          {qrLoading ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Generating QR...</span>
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
          className="rounded-full"
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
          Scan this QR code at the business to redeem your offer. You can always
          view the code later at Profile {">"} My Wallet.
        </p>
      </div>

      {/* Offer code row */}
      <div className="rounded-xl border border-gray-200 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-sm font-medium text-gray-700">
            Your Offer Code:
          </div>
          <button
            onClick={handleCopy}
            className="text-sm text-secondary underline underline-offset-4 hover:text-secondary/80 disabled:opacity-50"
            aria-label="Copy offer code"
            disabled={!offerCode}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-3">
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
          <strong>Note:</strong> Keep your code safe, as it is a one-time code
          and will expire after use. Code expires on{" "}
          {claimData?.expiryDate
            ? new Date(claimData.expiryDate).toLocaleDateString()
            : "the offer expiry date"}
          .
        </p>
      </div>

      {/* Share Button */}
      <div className="text-center">
        <Button
          onClick={handleShare}
          variant="outline"
          className="rounded-full"
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
  );
}

export default function OfferPopup({
  offer,
  open,
  onOpenChange,
  onClaimSuccess, // NEW: Add the callback prop
}: {
  offer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaimSuccess?: () => void; // NEW: Add the callback prop
}) {
  return (
    <PopupSection
      open={open}
      onClose={() => onOpenChange(false)}
      offer={offer}
      onClaimSuccess={onClaimSuccess} // NEW: Pass the callback
    />
  );
}
