"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Checkbox } from "@/components/common/checkbox";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Login } from "@/features/slicer/AuthSlice";
import toast from "react-hot-toast";
import Link from "next/link";

export function LoginForm() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    emailorPhone: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.emailorPhone.trim() !== "" && formData.password.trim() !== "";

  const handleFinishClick = async () => {
    if (formData.password.length < 8) {
      toast.error("password must be at least 8 characters");
    }
    try {
      setIsLoading(true);
      const res = await dispatch(Login(formData) as any).unwrap();
      const token = res.data.token;
      if (rememberMe) {
        localStorage.setItem("token", token); // persist login
      } else {
        sessionStorage.setItem("token", token); // clear on browser close
      }
      window.location.href = "/";
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
        <h1 className="text-h6 mb-2">{t("Auth.login.title")}</h1>
        <p className="text-small-regular text-grey-2">
          {t("Auth.login.subtitle")}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        {/* Email or Phone */}
        <div>
          <div className="relative">
            <Mail
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-grey-3",
                isRTL ? "right-3" : "left-3"
              )}
              size={16}
            />
            <Input
              type="text"
              name="emailorPhone"
              placeholder={t("Auth.login.emailOrPhone")}
              value={formData.emailorPhone}
              onChange={handleChange}
              className={cn("h-12", isRTL ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-grey-3",
                isRTL ? "right-3" : "left-3"
              )}
              size={16}
            />
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              name="password"
              onChange={handleChange}
              placeholder={t("Auth.login.password")}
              className={cn("h-12", isRTL ? "pr-10 pl-10" : "pl-10 pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-grey-3",
                isRTL ? "left-3" : "right-3"
              )}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div
          className={cn(
            "flex items-center justify-between",
            isRTL ? "flex-row-reverse" : ""
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-small-regular text-grey-2"
            >
              {t("Auth.login.rememberMe")}
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-small-regular text-primary hover:underline"
          >
            {t("Auth.login.forgotPassword")}
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          disabled={isLoading || !isFormValid}
          onClick={handleFinishClick}
          type="button"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t("Auth.login.signIn")
          )}
        </Button>
      </form>
    </div>
  );
}
