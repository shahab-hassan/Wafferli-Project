"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepFooter } from "@/components/seller/step-input";
import { Input } from "@/components/common/input";
import { ComboSelect } from "@/components/seller/combo-select";
import { PaymentPlan } from "@/components/seller/payement-plan";
import { SellerHero } from "@/components/seller/hero-panel";

function CardBrands() {
  return (
    <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
      <span className="h-5 w-8 rounded-[6px] bg-[#1A1F71]" title="Visa" />
      <span className="h-5 w-8 rounded-[6px] bg-[#EB001B]" title="Mastercard" />
      <span className="h-5 w-8 rounded-[6px] bg-[#016FD0]" title="Amex" />
      <span className="h-5 w-8 rounded-[6px] bg-[#FF5F00]" title="Discover" />
    </div>
  );
}

const COUNTRIES = ["Kuwait", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman"];

export default function Step4() {
  const router = useRouter();
  const [country, setCountry] = useState("Kuwait");
  const [postal, setPostal] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1220px] w-full mx-auto mt-10 mb-10 px-4">
      <div>
        <SellerHero stepIndex={0} />
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-[var(--brand-ink)]">
            Full Name
            <Input placeholder="Full name as per card" />
          </label>
          <label className="relative text-sm font-medium text-[var(--brand-ink)] md:col-span-2">
            Card Number
            <Input placeholder="1234 1234 1234 1234" className="pr-40" />
            <CardBrands />
          </label>
          <label className="text-sm font-medium text-[var(--brand-ink)]">
            CVC
            <Input placeholder="CVC" />
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComboSelect
              label="Country"
              items={COUNTRIES}
              value={country}
              onChange={setCountry}
            />
            <label className="text-sm font-medium text-[var(--brand-ink)]">
              Postal code
              <Input
                placeholder="91710"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[var(--brand-ink)]">
            Payment Type
          </h3>
          <p className="mt-1 text-sm text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">
            Defaults to all ad posting, but can be changed separately for each
            ad
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <PaymentPlan id="monthly" label="Pay Monthly" price="$20 / Month" />
            <PaymentPlan
              id="annually"
              label="Pay Annually"
              price="$18 / Month"
              badge="Save 20%"
              defaultChecked
            />
          </div>
          <p className="mt-2 text-[11px] text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">
            * Rates subject to change or revision. All amount is totaled from
            the number/type of ad post.
          </p>
        </div>

        <StepFooter
          nextLabel="Become A Seller"
          onNext={() => {
            // toggleRole();
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
