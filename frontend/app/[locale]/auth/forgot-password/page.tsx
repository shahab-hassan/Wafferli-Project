"use client";

import React from "react";
import { ForgotPassword } from "@/components/auth/forgot-password";
import { useLocale } from "next-intl";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className={`p-10 flex justify-center items-center px-4 ${
        isRTL ? "direction-rtl" : "direction-ltr"
      }`}
    >
      <div className="w-full max-w-md dark:bg-gray-900 rounded-2xl shadow-lg">
        <ForgotPassword />
      </div>
    </div>
  );
}
