import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Footer from "@/components/common/footer/footer";
import Breadcrumb from "@/components/common/breadcrumb-secction";
import Navbar from "@/components/common/navbar";
import "./globals.css";
import { WishlistProvider } from "@/contexts/wishListContext";
import ChatBot from "@/components/common/chatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wafferli App",
  description: "A web platform that connects customers and businesses through exclusive offers, powerful marketing tools, and a multi-purpose discovery ecosystem",
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
      <WishlistProvider>
          <div
            lang={locale}
            dir={dir}
            className={`${inter.variable} flex flex-col min-h-screen`}
          >
            <Navbar />
            <Breadcrumb />
            <ChatBot/>
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
      </WishlistProvider>
    </NextIntlClientProvider>
  );
}
