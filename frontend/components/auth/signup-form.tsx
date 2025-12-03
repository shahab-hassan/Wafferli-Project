// components/SignupForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Checkbox } from "@/components/common/checkbox";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  ShieldCheck,
  User2,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  SignUp,
  SendSignupOtp,
  VerifySignupOtp,
  ResendOtp,
} from "@/features/slicer/AuthSlice";
import toast from "react-hot-toast";

export function SignupForm() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [hasReferral, setHasReferral] = useState<boolean | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [step, setStep] = useState(1); // 1: Signup Details, 2: Referral, 3: OTP Verification
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password === formData.confirmPassword;

  // Step 1 → Send OTP
  const handleSendOTP = async (): Promise<void> => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    if (formData.password.trim().length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(
        SendSignupOtp({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          referralCode: referralCode,
        }) as any
      ).unwrap();

      console.log(res, "res"); // confirm output

      const status = res?.statusCode;
      if (status === 200) {
        setStep(3);
      }
      if (status === 201) {
        toast.success("User already exists but not verified — OTP resent");
        setStep(3);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Handle referral and move to OTP verification
  const handleNextStep = async () => {
    if (hasReferral === true && !referralCode.trim()) {
      toast.error("Please enter referral code or skip");
      return;
    }
    setStep(3); // Move to OTP verification
  };

  // Step 3 → Verify OTP and complete signup
  const handleVerifyOTP = async (): Promise<void> => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    const signupData = {
      ...formData,
      otp,
    };

    try {
      setLoading(true);
      const res = await dispatch(VerifySignupOtp(signupData) as any).unwrap();
      console.log(res, "res");
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(
        ResendOtp({ email: formData.email }) as any
      ).unwrap();
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Signup Details */}
      {step === 1 && (
        <>
          <div
            className={cn(
              "text-center mb-8",
              isRTL ? "text-right" : "text-left"
            )}
          >
            <h1 className="text-h6 font-bold text-gray-900 mb-3">
              {t("Auth.signup.title")}
            </h1>
            <p className="text-small-regular text-grey-2 leading-relaxed">
              {t("Auth.signup.subtitle")}
            </p>
          </div>

          <form className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <div className="relative">
                <User
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t("Auth.signup.fullName")}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  )}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("Auth.signup.emailAddress")}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  )}
                />
              </div>
            </div>

            {/* Referral Code Field */}
            {/*<div className="space-y-2">
              <div className="relative">
                <UserRoundPlus
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="e.g WF-124893"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  )}
                />
              </div>
            </div> */ }

            {/* Phone Number Field */}
            <div className="space-y-2">
              <div className="relative">
                <Phone
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t("Auth.signup.phoneNumber")}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  )}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("Auth.signup.password")}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 hover:text-grey-4 transition-colors z-10",
                    isRTL ? "left-3" : "right-3"
                  )}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 z-10",
                    isRTL ? "right-3" : "left-3"
                  )}
                  size={18}
                />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("Auth.signup.confirmPassword")}
                  className={cn(
                    "h-12 w-full text-normal-regular",
                    isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 hover:text-grey-4 transition-colors z-10",
                    isRTL ? "left-3" : "right-3"
                  )}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div
                className={cn(
                  "flex items-start gap-3",
                  isRTL ? "flex-row-reverse" : ""
                )}
              >
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                  className="mt-0.5 flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-small-regular text-grey-2 leading-relaxed cursor-pointer"
                >
                  {t("Auth.signup.agreeToTerms")}{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    {t("Auth.signup.termsOfService")}
                  </a>{" "}
                  {t("Auth.signup.and")}{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    {t("Auth.signup.privacyPolicy")}
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="button"
                className="w-full h-12 bg-primary hover:bg-primary/90 !text-white text-normal-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!agreeToTerms || loading || !isFormValid}
                onClick={handleSendOTP}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {loading
                  ? "Creating Account..."
                  : t("Auth.signup.createAccount")}
              </Button>
            </div>
          </form>
        </>
      )}

      {/* <>
      {step === 2 && (
        <div className="space-y-6 p-6 bg-white rounded-lg border border-grey-5 mx-auto max-w-sm">
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-primary hover:underline mb-4"
          >
            <span className={isRTL ? "ml-2" : "mr-2"}>&larr;</span>
            {t("Auth.signup.back")}
          </button>

          {hasReferral === null && (
            <>
              <h2 className="text-lg font-semibold text-center">
                {t("Auth.signup.referral.title")}
              </h2>
              <p className="text-center text-sm text-grey-2">
                {t("Auth.signup.referral.subtitle")}
              </p>

              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setHasReferral(true)}
                >
                  {t("Auth.signup.referral.enterCode") || "I have a code"}
                </Button>

                <Button
                  type="button"
                  className="w-full h-12 bg-grey-3 hover:bg-grey-4 text-white"
                  onClick={handleNextStep}
                >
                  {t("Auth.signup.withoutReferralCode") || "Skip"}
                </Button>
              </div>
            </>
          )}

          {hasReferral === true && (
            <>
              <h2 className="text-lg font-semibold text-center">
                {t("Auth.signup.referral.title")}
              </h2>
              <p className="text-center text-sm text-grey-2">
                {t("Auth.signup.referral.subtitle")}
              </p>

              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("Auth.signup.referral.placeholder")}
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={cn(
                    "h-12 w-full text-center",
                    isRTL ? "pr-10" : "pl-10"
                  )}
                />
              </div>

              <p className="text-center text-sm text-grey-2">
                {t("Auth.signup.referral.discount")}
              </p>

              <Button
                type="button"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                onClick={handleNextStep}
                disabled={!referralCode.trim()}
              >
                {t("Auth.signup.continue")}
              </Button>
            </>
          )}
        </div>
      )}
</> */}

      {/* Step 3: OTP Verification */}
      {step === 3 && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-primary hover:underline mb-4"
          >
            <span className={isRTL ? "ml-2" : "mr-2"}>&larr;</span>
            {t("Auth.signup.back")}
          </button>

          <div
            className={cn("text-center", isRTL ? "text-right" : "text-left")}
          >
            <h1 className="text-h6 mb-2">{t("Auth.signup.verifyOtpTitle")}</h1>
            <p className="text-small-regular text-grey-2">
              {t("Auth.signup.verifyOtpSubtitle")}{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <ShieldCheck
                className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 text-grey-3",
                  isRTL ? "right-3" : "left-3"
                )}
                size={18}
              />
              <Input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder={t("Auth.signup.enterOtp")}
                className={cn("h-12 w-full", isRTL ? "pr-10" : "pl-10")}
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              disabled={loading || !otp}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                t("Auth.signup.verifyOtp")
              )}
            </Button>

            <p className="text-center text-sm text-grey-2">
              {t("Auth.signup.resendText")}{" "}
              <button
                onClick={handleResendOtp}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {t("Auth.signup.resendBtn")}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
