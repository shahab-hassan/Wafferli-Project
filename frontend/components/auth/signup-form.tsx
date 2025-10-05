// components/SignupForm.tsx (or wherever SignupForm is defined)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Checkbox } from "@/components/common/checkbox";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useIsLogin } from "@/contexts/isLoginContext";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { isLogin, setIsLogin } = useIsLogin();
const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [step, setStep] = useState(1); // 1 for Signup Details, 2 for Referral

  const handleNextStep = () => {
    if (agreeToTerms) {
      setStep(2); // Proceed to referral step only if terms are agreed
    }
  };

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
      {step === 1 && (
        <>
          <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
            <h1 className="text-h6 mb-2">{t("Auth.signup.title")}</h1>
            <p className="text-small-regular text-grey-2">{t("Auth.signup.subtitle")}</p>
          </div>
          <form className="space-y-4">
            <div>
              <div className="relative">
                <User
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
                  size={16}
                />
                <Input
                  type="text"
                  placeholder={t("Auth.signup.fullName")}
                  className={cn("h-12 w-full", isRTL ? "pr-10" : "pl-10")}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Mail
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
                  size={16}
                />
                <Input
                  type="email"
                  placeholder={t("Auth.signup.emailAddress")}
                  className={cn("h-12 w-full", isRTL ? "pr-10" : "pl-10")}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Phone
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
                  size={16}
                />
                <Input
                  type="tel"
                  placeholder={t("Auth.signup.phoneNumber")}
                  className={cn("h-12 w-full", isRTL ? "pr-10" : "pl-10")}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
                  size={16}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("Auth.signup.password")}
                  className={cn("h-12 w-full", isRTL ? "pr-10 pl-10" : "pl-10 pr-10")}
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
            <div>
              <div className="relative">
                <Lock
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "right-3" : "left-3")}
                  size={16}
                />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("Auth.signup.confirmPassword")}
                  className={cn("h-12 w-full", isRTL ? "pr-10 pl-10" : "pl-10 pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={cn("absolute top-1/2 transform -translate-y-1/2 text-grey-3", isRTL ? "left-3" : "right-3")}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className={cn("flex items-start gap-2", isRTL ? "flex-row-reverse" : "")}>
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-small-regular text-grey-2 leading-relaxed">
                {t("Auth.signup.agreeToTerms")}{" "}
                <a href="#" className="text-primary hover:underline">
                  {t("Auth.signup.termsOfService")}
                </a>{" "}
                {t("Auth.signup.and")}{" "}
                <a href="#" className="text-primary hover:underline">
                  {t("Auth.signup.privacyPolicy")}
                </a>
              </label>
            </div>
            <Button
              type="button"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              disabled={!agreeToTerms}
              onClick={handleNextStep}
            >
              {t("Auth.signup.nextStep")}
            </Button>
          </form>
        </>
      )}
      {step === 2 && (
        <div className="space-y-6 p-6 bg-white rounded-lg border border-grey-5 mx-auto max-w-sm">
          <button
            onClick={() => setStep(1)}
            className="bg-primary text-white px-3 py-1 rounded-tl-lg mb-4 flex items-center"
          >
            &larr;
          </button>
          <h2 className="text-lg font-semibold text-center">{t("Auth.signup.referral.title")}</h2>
          <p className="text-center text-sm text-grey-2">{t("Auth.signup.referral.subtitle")}</p>
          <div className="relative">
            <Input
              type="text"
              placeholder={t("Auth.signup.referral.placeholder")}
              className={cn("h-12 w-full text-center", isRTL ? "pr-10" : "pl-10")}
            />
          </div>
          <p className="text-center text-sm text-grey-2">{t("Auth.signup.referral.discount")}</p>
          <Button
            type="button"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            onClick={handleFinishClick}
          >
            {t("Auth.signup.finish")}
          </Button>
        </div>
      )}
    </div>
  );
}