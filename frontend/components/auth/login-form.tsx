"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Checkbox } from "@/components/common/checkbox"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useIsLogin } from "@/contexts/isLoginContext";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { isLogin, setIsLogin } = useIsLogin();
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter();


  const handleFinishClick = useCallback(() => {
    setIsLogin(true); // Set isLogin to true
    console.log("isLogin set to:", true); // Debug log
  }, [setIsLogin]);

    // Navigate after isLogin changes
    useEffect(() => {
      if (isLogin) {
        setTimeout(() => {
          router.push(`/?loggedin=true`); // Redirect with query param
        }, 0);
      }
    }, [isLogin, router]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
        <h1 className="text-h6 mb-2">{t("Auth.login.title")}</h1>
        <p className="text-small-regular text-grey-2">{t("Auth.login.subtitle")}</p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        {/* Email or Phone */}
        <div>
          <div className="relative">
            <Mail
              className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
              size={16}
            />
            <Input
              type="text"
              placeholder={t("Auth.login.emailOrPhone")}
              className={cn("h-12", isRTL ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock
              className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
              size={16}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("Auth.login.password")}
              className={cn("h-12", isRTL ? "pr-10 pl-10" : "pl-10 pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "left-3" : "right-3")}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
          <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label htmlFor="remember" className="text-small-regular text-grey-2">
              {t("Auth.login.rememberMe")}
            </label>
          </div>
          <button type="button" className="text-small-regular text-primary hover:underline">
            {t("Auth.login.forgotPassword")}
          </button>
        </div>

        {/* Sign In Button */}
        <Button onClick={handleFinishClick} type="button" className="w-full h-12 bg-primary hover:bg-primary/90 text-white">
          {t("Auth.login.signIn")}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-grey-5"></div>
          </div>
          <div className="relative flex justify-center text-small-regular">
            <span className="bg-white px-4 text-grey-3">{t("Auth.login.orContinueWith")}</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 bg-transparent"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("Auth.login.signInWithGoogle")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 bg-transparent"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                fill="currentColor"
              />
            </svg>
            {t("Auth.login.signInWithApple")}
          </Button>
        </div>
      </form>
    </div>
  )
}