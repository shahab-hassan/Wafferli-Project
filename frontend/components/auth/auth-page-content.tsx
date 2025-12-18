"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AuthLayout } from "./auth-layout";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { useSearchParams } from "next/navigation";

export function AuthPageContent() {

  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "signin" | "signup") || "signin";
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations();

  return (
    <AuthLayout>
      <div className="bg-white rounded-lg border border-grey-5 w-full max-w-sm sm:max-w-md mx-auto overflow-hidden">
        <div className="relative h-10 sm:h-12">
          {/* Background layer */}
          <div className="absolute top-0 left-0 w-full h-10 sm:h-12 bg-gray-50 border-b border-gray-200 rounded-t-lg"></div>

          {/* Tab buttons */}
          <div className="relative h-10 sm:h-12 flex">
            <button
              onClick={() => setActiveTab("signin")}
              className={cn(
                "flex-1 h-10 sm:h-12 flex items-center justify-center text-sm sm:text-lg font-semibold transition-colors rounded-tl-lg",
                activeTab === "signin"
                  ? "bg-white text-primary border-b border-gray-200 relative z-10"
                  : "text-gray-600 hover:text-gray-800 bg-transparent",
                isRTL ? "rounded-tr-lg rounded-tl-none" : ""
              )}
            >
              {t("Auth.login.signIn")}
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 h-10 sm:h-12 flex items-center justify-center text-sm sm:text-lg font-semibold transition-colors rounded-tr-lg",
                activeTab === "signup"
                  ? "bg-white text-primary border-b border-gray-200 relative z-10"
                  : "text-gray-600 hover:text-gray-800 bg-transparent",
                isRTL ? "rounded-tl-lg rounded-tr-none" : ""
              )}
            >
              {t("Auth.login.createAccount")}
            </button>
          </div>
        </div>
        {/* Form Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "signin" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </AuthLayout>
  );
}
