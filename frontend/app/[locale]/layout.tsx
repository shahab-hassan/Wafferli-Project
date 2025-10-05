import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Footer from "@/components/common/footer/footer";
import Breadcrumb from "@/components/common/breadcrumb-secction";
import NavbarAuth from "@/components/common/navbar-auth";
import "./globals.css";
import { RoleProvider } from "@/contexts/roleContext";
import { WishlistProvider } from "@/contexts/wishListContext";
import { OnboardingProvider } from "@/contexts/onboarding-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wafferli App",
  description: "Created by DH Solution",
  generator: "asjad ilahi",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale}>
      <RoleProvider> {/* new: wrap with RoleProvider */}
        <WishlistProvider>
          <OnboardingProvider>
        <div lang={locale} dir={dir} className={`${inter.variable} flex flex-col min-h-screen`}>
          <NavbarAuth />
          <Breadcrumb />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        </OnboardingProvider>
        </WishlistProvider>
      </RoleProvider>
      
    </NextIntlClientProvider>
  );
}