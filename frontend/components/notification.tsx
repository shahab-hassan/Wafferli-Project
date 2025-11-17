"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import {
  GetNotification,
  MarkNotificationClick,
  MarkNotificationRead,
} from "@/features/slicer/NotificationSlice";
import { useRouter } from "next/navigation";

interface NotificationDropdownProps {
  className?: string;
}

export default function NotificationDropdown({
  className,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navbar");
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);
  const { notifications, loading, stats, statsLoading } = useSelector(
    (state: any) => state.notification
  );

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      dispatch(GetNotification({ page: 1, limit: 10 }) as any);
    }
  }, [isOpen, user, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.isRead) {
        await dispatch(MarkNotificationRead(notification._id) as any);
      }

      // Use actionData URL if available (most reliable)
      // if (notification.actionData?.actionUrl) {
      //   router.push(notification.actionData.actionUrl);
      // }
      // Fallback to adId-based routing
      else if (notification.adId) {
        const adType = notification.adId.adType || "ad";

        switch (adType) {
          case "product":
            router.push(`/product/${notification.adId._id}`);
            break;
          case "offer":
            router.push(`/offers/${notification.adId._id}`);
            break;
          case "event":
            router.push(`/events/${notification.adId._id}`);
            break;
          case "service":
            router.push(`/services/${notification.adId._id}`);
            break;
          case "explore":
            router.push(`/explore/${notification.adId._id}`);
            break;
          default:
            router.push(`/`);
        }
      }

      setIsOpen(false);
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        className={cn(
          "relative p-2 rounded-full transition-all duration-200",
          "hover:bg-gray-100 border-2 border-transparent",
          isOpen && "bg-gray-100 border-gray-200",
          "group"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading || statsLoading}
      >
        {statsLoading ? (
          <Loader2 size={20} className="text-gray-600 animate-spin" />
        ) : (
          <Bell size={20} className="text-gray-600 group-hover:text-gray-700" />
        )}

        {!statsLoading && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm">
              {t("notifications") || "Notifications"}{" "}
              {unreadCount > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ({unreadCount} unread)
                </span>
              )}
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Loader2
                  size={24}
                  className="text-gray-400 animate-spin mb-3"
                />
                <p className="text-sm text-gray-500">
                  Loading notifications...
                </p>
              </div>
            ) : notifications?.length > 0 ? (
              <div className="p-2">
                {notifications?.map((notification: any) => (
                  <div
                    key={notification._id}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg cursor-pointer group transition-all",
                      "hover:bg-gray-50 border border-transparent hover:border-gray-100",
                      !notification.isRead && "bg-blue-50/50 hover:bg-blue-50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm font-medium truncate",
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          {notification.title}
                        </h4>

                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Price Section */}
                      {notification.priceData && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500 line-through">
                            {notification.priceData.originalPrice}
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            {notification.priceData.newPrice}
                          </span>
                          <span className="text-xs text-red-500 font-medium">
                            ({notification.priceData.discountPercent}% OFF)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  No notifications
                </h4>
                <p className="text-xs text-gray-500">
                  We'll notify you when something arrives
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
