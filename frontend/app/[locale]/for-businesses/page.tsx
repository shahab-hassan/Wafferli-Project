// import { getTranslations } from "next-intl/server"
// import { HeroSection } from "@/components/for-businesses/hero"
// import { BenefitsSection } from "@/components/for-businesses/benefits-section"
// import { AdTypesSection } from "@/components/for-businesses/ad-types"
// import  TestimonialsCarousel  from "@/components/for-businesses/testimonials"
// import  CallToActionSection  from "@/components/for-businesses/call-to-action"

// export default async function ForBusinessesPage({
//   params,
// }: {
//   params: Promise<{ locale: string }>
// }) {
//   const { locale } = await params
//   const t = await getTranslations({ locale, namespace: "ForBusinesses" })
//   const isRTL = locale === "ar"

//   return (
//     <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
//       {/* <HeroSection locale={locale} />
//       <BenefitsSection locale={locale} />
//       <AdTypesSection locale={locale} />
//       <TestimonialsCarousel locale={locale} />
//       <CallToActionSection /> */}
//     </div>
//   )
// }

import React from "react";

export default function page() {
  return <div>Pending</div>;
}
