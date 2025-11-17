// components/profile-popup.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Grid, CreditCard, Heart, Settings, LogOut, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { CheckAuth, Logout, setRole } from "@/features/slicer/AuthSlice";

type User = {
  _id?: string;
  fullName?: string;
  email?: string;
  referralCode?: string;
  loyaltyPoints?: number;
  membershipStatus?: string;
};

type Props = {
  currentLocale: "en" | "ar";
  open: boolean;
  onClose?: () => void;
  mobileLayout?: boolean;
};

export default function ProfileDropdown({
  currentLocale,
  open,
  onClose,
  mobileLayout = false,
}: Props) {
  const t = useTranslations("Navbar");
  const role = useSelector((state: any) => state.auth.role);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = React.useState(false);
  const router = useRouter();

  // Get user initials from fullName
  const getUserInitials = (fullName: string = "") => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    const res = await dispatch(Logout() as any).unwrap();
    if (res.success) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  };

  const toggleRole = async () => {
    try {
      if (role === "user") {
        // ✅ Backend role check
        const res = await dispatch(CheckAuth() as any).unwrap();
        console.log(res, "response");
        const backendRole = res?.data?.role;

        if (backendRole === "user") {
          // ✅ Backend bhi user → Go to become seller
          router.push("/become-seller");
        } else {
          // ✅ Backend role seller hai → go to seller
          dispatch(setRole("seller") as any);
        }
      } else {
        // ✅ Redux role seller → switch to user
        dispatch(setRole("user") as any);
        router.push("/");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (!dropdownRef.current) return;
      const rect = dropdownRef.current.getBoundingClientRect();
      // small 8px safety margin
      const overflowRight = rect.right > window.innerWidth - 8;
      const overflowLeft = rect.left < 8;

      // decide flip: if it overflows to the right, flip to left, and vice versa
      if (overflowRight) setFlipped(true);
      else if (overflowLeft) setFlipped(false);
      else setFlipped(false);
    });
    return () => cancelAnimationFrame(id);
  }, [open, currentLocale]);

  if (!open || !user) return null;

  // make layout direction and text align consistent with locale
  const dir = currentLocale === "ar" ? "rtl" : "ltr";
  const alignClass = currentLocale === "ar" ? "text-right" : "text-left";
  const flexDir = currentLocale === "ar" ? "flex-row-reverse" : "flex-row";

  // Mobile layout: render as an inline block (no absolute positioning)
  if (mobileLayout) {
    return (
      <div
        role="dialog"
        aria-label={t("profile")}
        dir={dir}
        className="w-full bg-background border-t border-grey-5"
      >
        {/* Profile header */}
        <div className="p-4">
          <div className={cn("flex items-center gap-3", flexDir)}>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-medium">
                {getUserInitials(user.fullName)}
              </span>
            </div>
            <div className="min-w-0">
              <div
                className={cn(
                  "font-medium text-foreground truncate",
                  alignClass
                )}
              >
                {user.fullName || user.email}
              </div>
              <div className={cn("text-xs text-gray-600 truncate", alignClass)}>
                {user.email}
              </div>
              <div className={cn("text-xs text-gray-500 mt-1", alignClass)}>
                {user.membershipStatus} Member
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty card + Switch seller/user */}
        <div className="p-4">
          <div className="rounded-lg overflow-hidden mb-3" aria-hidden>
            <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
              <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
                <Star size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-lg leading-tight">
                  {user.loyaltyPoints?.toLocaleString() || 0}
                </div>
                <div className="text-xs opacity-90">{t("loyaltyPoints")}</div>
              </div>
            </div>
          </div>
          {role === "user" && (
            <button
              onClick={toggleRole}
              className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:brightness-95 transition"
            >
              {t("becomeSeller")}
            </button>
          )}
        </div>

        <div className="border-t border-grey-5">
          <nav className="flex flex-col px-4 py-2">
            {role === "seller" && (
              <Link
                href={`/${currentLocale}/all-my-ads`}
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-3 hover:bg-primary/10 transition-colors rounded-lg"
              >
                <Grid size={16} />
                <span className="text-sm">{t("myAds")}</span>
              </Link>
            )}

            {role === "seller" && (
              <Link
                href={`/${currentLocale}/wallet`}
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-3 hover:bg-primary/10 transition-colors rounded-lg"
              >
                <CreditCard size={16} />
                <span className="text-sm">{t("myWallet")}</span>
              </Link>
            )}

            <Link
              href={`/${currentLocale}/wishlist`}
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-3 hover:bg-primary/10 transition-colors rounded-lg"
            >
              <Heart size={16} />
              <span className="text-sm">{t("favourites")}</span>
            </Link>

            <div className="my-2 border-t border-grey-5" />

            <Link
              href={`/${currentLocale}/settings`}
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-3 hover:bg-primary/10 transition-colors rounded-lg"
            >
              <Settings size={16} />
              <span className="text-sm">{t("settings")}</span>
            </Link>

            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-2 py-3 hover:bg-red-600 hover:text-white transition-colors text-red-600 rounded-lg"
            >
              <LogOut size={16} />
              <span className="text-sm">{t("logout")}</span>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={t("profile")}
      dir={dir}
      ref={dropdownRef}
      onMouseLeave={onClose}
      className={cn(
        // base
        "absolute top-full mt-2 w-[260px] bg-background border border-border rounded-lg shadow-lg z-50",
        // position logic: default based on locale, flipped if overflow detected
        ((): string => {
          // default anchor
          const defaultAnchor =
            currentLocale === "ar"
              ? "left-0 origin-top-left"
              : "right-0 origin-top-right";

          // flipped anchor (mirror)
          const flippedAnchor =
            currentLocale === "ar"
              ? "right-0 origin-top-right"
              : "left-0 origin-top-left";

          return flipped ? flippedAnchor : defaultAnchor;
        })()
      )}
    >
      {/* Profile header */}
      <div className="p-3 border-b border-grey-5">
        <div className={cn("flex items-center gap-3", flexDir)}>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-medium">
              {getUserInitials(user.fullName)}
            </span>
          </div>
          <div className="min-w-0">
            <div
              className={cn("font-medium text-foreground truncate", alignClass)}
            >
              {user.fullName || user.email}
            </div>
            <div className={cn("text-xs text-gray-600 truncate", alignClass)}>
              {user.email}
            </div>
            <div className={cn("text-xs text-gray-500 mt-1", alignClass)}>
              {user.membershipStatus} Member
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty card + Switch seller/user */}
      <div className="p-3">
        <div className="rounded-lg overflow-hidden mb-3" aria-hidden>
          <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
            <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
              <Star size={18} />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-lg leading-tight">
                {user.loyaltyPoints?.toLocaleString() || 0}
              </div>
              <div className="text-xs opacity-90">{t("loyaltyPoints")}</div>
            </div>
          </div>
        </div>

        {role === "user" && (
          <button
            onClick={toggleRole}
            className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:brightness-95 transition"
          >
            {t("becomeSeller")}
          </button>
        )}
      </div>

      <div className="border-t border-grey-5">
        <nav className="flex flex-col">
          <Link
            href={`/${currentLocale}/wallet`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
          >
            <CreditCard size={16} />
            <span className="text-sm">{t("myWallet")}</span>
          </Link>

          {role === "seller" && (
            <Link
              href={`/${currentLocale}/all-my-ads`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
            >
              <Grid size={16} />
              <span className="text-sm">{t("myAds")}</span>
            </Link>
          )}

          <Link
            href={`/${currentLocale}/wishlist`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
          >
            <Heart size={16} />
            <span className="text-sm">{t("favourites")}</span>
          </Link>

          <div className="my-2 border-t border-grey-5" />

          <Link
            href={`/${currentLocale}/settings`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
          >
            <Settings size={16} />
            <span className="text-sm">{t("settings")}</span>
          </Link>

          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-600 hover:text-white transition-colors text-red-600"
          >
            <LogOut size={16} />
            <span className="text-sm">{t("logout")}</span>
          </div>
        </nav>
      </div>
    </div>
  );
}
