"use client";

import { ArrowLeft, X } from "lucide-react";
import { Button } from "../common/button";
import { Avatar } from "../common/avatar";

export function ChatHeader({ selected, onlineUsers, onBack, onClose }: any) {
  const isOnline = onlineUsers.includes(selected?.user?._id);

  // Enhanced user info detection with better business handling
  const getUserInfo = () => {
    if (!selected) return null;

    console.log("Selected chat data:", selected); // Debug log

    // Check if it's a business in different possible ways
    const isBusiness =
      selected.business ||
      selected.user?.role === "seller" ||
      selected.user?.businessType === "business" ||
      (selected.user && selected.user.businessName);

    let displayName = selected.user?.fullName || "Unknown User";
    let avatar = selected.user?.profileImage || "";
    let businessInfo = null;

    if (isBusiness) {
      // Priority: business object > user business data
      if (selected.business) {
        displayName =
          selected.business.name ||
          selected.business.businessName ||
          displayName;
        avatar =
          selected.business.logo || selected.business.profileImage || avatar;
        businessInfo = selected.business;
      } else if (selected.user) {
        // User has business data directly
        displayName =
          selected.user.businessName || selected.user.name || displayName;
        avatar = selected.user.logo || selected.user.businessLogo || avatar;
        businessInfo = selected.user;
      }
    }

    return {
      isBusiness,
      displayName,
      avatar,
      businessInfo,
    };
  };

  const userInfo = getUserInfo();

  if (!selected || !userInfo) return null;

  return (
    <div className="border-b bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden size-8 hover:bg-gray-100"
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div className="relative">
          <Avatar className="size-10 border-2 border-white shadow-sm">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.displayName}
                className="object-cover w-full h-full"
              />
            ) : (
              <Avatar>
                {userInfo.displayName?.slice(0, 2).toUpperCase() || "U"}
              </Avatar>
            )}
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold text-gray-900 text-sm truncate">
              {userInfo.displayName}
            </h2>
            {userInfo.isBusiness && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                Business
              </span>
            )}
          </div>

          <p
            className={`text-xs ${
              isOnline ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="size-8 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        title="Close chat"
      >
        <X className="size-5" />
      </Button>
    </div>
  );
}
