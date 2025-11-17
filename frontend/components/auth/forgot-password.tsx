"use client";

import React, { useState, ChangeEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/common/input";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Forgot, Resend, Reset, Verify } from "@/features/slicer/AuthSlice";

export function ForgotPassword() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  // Step 1 → Send OTP

  const hanldeResendOtp = async (): Promise<void> => {
    if (!email) {
      toast.error(t("Auth.forgot.emailPlaceholder" as any));
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(Resend({ email }) as any).unwrap();
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSendOTP = async (): Promise<void> => {
    if (!email) {
      toast.error(t("Auth.forgot.emailPlaceholder" as any));
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(Forgot({ email }) as any).unwrap();
      console.log(res, "res");
      if (res.success) {
        setStep(2);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify OTP
  const handleVerifyOTP = async (): Promise<void> => {
    if (!otp) {
      toast.error(t("Auth.forgot.otpPlaceholder" as any));
      return;
    }
    const obj = {
      otp,
      email,
    };

    try {
      setLoading(true);
      const res = await dispatch(Verify(obj) as any).unwrap();
      if (res.success) {
        setStep(3);
      }
      console.log(res, "res");
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 → Reset Password
  const handleResetPassword = async (): Promise<void> => {
    if (!password || !confirmPassword) {
      toast.error(t("Auth.forgot.resetSubtitle" as any));
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    const obj = {
      newPassword: password,
      email,
    };
    try {
      setLoading(true);
      const res = await dispatch(Reset(obj) as any).unwrap();
      if (res.success) {
        router.push("/auth");
      }
      console.log(res, "res");
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Input Handlers
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) =>
    setOtp(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
        {step === 1 && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              {t("Auth.forgot.title" as any)}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Auth.forgot.subtitle" as any)}
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              {t("Auth.forgot.otpTitle" as any)}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Auth.forgot.otpSubtitle" as any)}
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              {t("Auth.forgot.resetTitle" as any)}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Auth.forgot.resetSubtitle" as any)}
            </p>
          </>
        )}
      </div>

      {/* Step 1 → Enter Email */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Mail
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )}
              size={18}
            />
            <Input
              type="email"
              placeholder={t("Auth.forgot.emailPlaceholder" as any)}
              value={email}
              onChange={handleEmailChange}
              className={cn("h-12", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          <Button
            onClick={handleSendOTP}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              t("Auth.forgot.sendOtp" as any)
            )}
          </Button>
        </div>
      )}

      {/* Step 2 → Enter OTP */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="relative">
            <ShieldCheck
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )}
              size={18}
            />
            <Input
              type="text"
              placeholder={t("Auth.forgot.otpPlaceholder" as any)}
              value={otp}
              onChange={handleOtpChange}
              className="h-12 tracking-widest text-center"
            />
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              t("Auth.forgot.verifyOtp" as any)
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {t("Auth.forgot.resendText" as any)}{" "}
            <button
              onClick={hanldeResendOtp}
              className="text-primary hover:underline"
            >
              {t("Auth.forgot.resendBtn" as any)}
            </button>
          </p>
        </div>
      )}

      {/* Step 3 → Reset Password */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="relative">
            <Lock
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )}
              size={18}
            />
            <Input
              type="password"
              placeholder={t("Auth.forgot.newPassword" as any)}
              value={password}
              onChange={handlePasswordChange}
              className={cn("h-12", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          <div className="relative">
            <Lock
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )}
              size={18}
            />
            <Input
              type="password"
              placeholder={t("Auth.forgot.confirmPassword" as any)}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={cn("h-12", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          <Button
            onClick={handleResetPassword}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              t("Auth.forgot.resetBtn" as any)
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
