//navbar
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X, Download, } from "lucide-react";
import { Button } from "./button";
import { SearchBar } from "./nav-searchbar";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);

  const t = useTranslations("Navbar");
  const router = useRouter();
  const pathname = usePathname();

  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // get locale from pathname
  const currentLocale = (pathname || "").split("/")[1] === "ar" ? "ar" : "en";

  const moreItems = [
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
    { label: t("for_businesses"), href: "/for-businesses" },
    { label: t("privacy"), href: "/privacy-policy" },
    { label: t("terms"), href: "/terms" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setDesktopLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setMobileLangOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMoreOpen(false);
    setMoreModalOpen(false);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  };

  const closeMoreModal = () => {
    setMoreModalOpen(false);
  };

  const switchLocale = (locale: string) => {
    const segments = (pathname || "").split("/");
    segments[1] = locale;
    router.push(segments.join("/") || "/");
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  };

  // --- new: measure navbar bottom and pass to Breadcrumb as offsetTop ---
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [breadcrumbOffset, setBreadcrumbOffset] = useState<number>(80); // fallback

  useEffect(() => {
    const measure = () => {
      if (!navbarRef.current) return;
      const rect = navbarRef.current.getBoundingClientRect();
      // convert viewport bottom to document coordinate
      setBreadcrumbOffset(Math.round(rect.bottom + window.scrollY));
    };

    // initial measure
    measure();

    // update on resize and when the navbar element resizes
    const ro = new (window as any).ResizeObserver((entries: ResizeObserverEntry[]) => {
      measure();
    });
    if (navbarRef.current) ro.observe(navbarRef.current);

    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    return () => {
      if (ro && navbarRef.current) ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
    // We intentionally do NOT include many transient states here; ResizeObserver will handle layout changes.
  }, [pathname]);

  return (
    <>
      <div ref={navbarRef} id="main-navbar" className="relative z-[100] w-full bg-background">
        <div className="flex justify-center border border-b box-border border-grey-5">
          <div className="flex max-w-[1440px] w-full h-[65px] items-center justify-between px-[32px] py-[12px] min-w-0">
            {/* Left Section: Logo */}
            <div className="flex items-center">
              <Image src="/Logo.png" alt="Offerly Logo" width={85} height={40} className="object-contain" />
            </div>

            {/* Integrated Search Bar (hidden on mobile) */}
            <div className="hidden md:flex flex-1 px-4 lg:px-8">
              <SearchBar />
            </div>

            {/* Right Section (Desktop) */}
            <div className="hidden md:flex items-center gap-4 relative">
              <div className="relative" ref={desktopLangRef}>
                <button
                  className="flex items-center gap-1 text-normal-regular hover:text-primary transition-colors"
                  onClick={() => setDesktopLangOpen(!desktopLangOpen)}
                >
                  {currentLocale === "en" ? (
                    <>
                      <span role="img" aria-label="english-flag">🇬🇧</span> English
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="arabic-flag">🇰🇼</span> العربية
                    </>
                  )}
                  <ChevronDown size={16} className={cn("transition-transform", desktopLangOpen && "rotate-180")} />
                </button>

                {desktopLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => switchLocale("en")}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-white flex items-center gap-2 rounded-t-lg",
                        currentLocale === "en" && "bg-primary text-white font-medium"
                      )}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => switchLocale("ar")}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-white flex items-center gap-2 rounded-b-lg",
                        currentLocale === "ar" && "bg-primary text-white font-medium"
                      )}
                    >
                      🇰🇼 العربية
                    </button>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download size={16} />
                {t("app")}
              </Button>

              <Link href={`/${currentLocale}/auth`}>
              <Button variant="normal" size="sm" className="px-6">
                {t("login")}
              </Button>
              </Link>
              <Link href={`/${currentLocale}/auth`}>
              <Button variant="gradient" size="sm" className="text-white px-6">
                {t("signup")}
              </Button>
              </Link>
            </div>

            {/* Mobile Right Section - Language + Menu */}
            <div className="flex md:hidden items-center gap-3">
              <div className="relative" ref={mobileLangRef}>
                <button
                  className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                  onClick={() => setMobileLangOpen(!mobileLangOpen)}
                >
                  {currentLocale === "en" ? <span role="img" aria-label="english-flag">🇬🇧</span> : <span role="img" aria-label="arabic-flag">🇰🇼</span>}
                  <ChevronDown size={14} className={cn("transition-transform", mobileLangOpen && "rotate-180")} />
                </button>

                {mobileLangOpen && (
                  <div
                    className={cn(
                      "absolute top-full mt-2 w-36 bg-background border border-border rounded-lg shadow-lg z-[60]",
                      currentLocale === "ar" ? "left-0" : "right-0"
                    )}
                  >
                    <button
                      onClick={() => switchLocale("en")}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-primary hover:text-white flex items-center gap-2 rounded-t-lg",
                        currentLocale === "en" && "bg-primary text-white font-medium"
                      )}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => switchLocale("ar")}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-primary hover:text-white flex items-center gap-2 rounded-b-lg",
                        currentLocale === "ar" && "bg-primary text-white font-medium"
                      )}
                    >
                      🇰🇼 العربية
                    </button>
                  </div>
                )}
              </div>

              <button className="text-primary" onClick={() => setIsOpen(true)}>
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Subnav (Desktop Nav Links) */}
        <div className="hidden md:block bg-background border-b border-grey-5">
          <div className="max-w-[1440px] mx-auto px-[32px] py-[8px] h-[55px] flex items-center justify-between">
            <nav className="flex items-center gap-5 text-normal-regular text-color-grey-2 min-w-0 flex-wrap">
              <Link href={`/${currentLocale}/`} className="hover:text-primary transition-colors">
                {t("home")}
              </Link>
              <Link href={`/${currentLocale}/offers`} className="hover:text-primary transition-colors">
                {t("offers")}
              </Link>
              <Link href={`/${currentLocale}/flashdeals`} className="flex items-center gap-1 text-tertiary font-semibold hover:text-primary transition-colors">
                ⚡ {t("flashDeals")}
              </Link>
              <Link href={`/${currentLocale}/explore`} className="hover:text-primary transition-colors">
                {t("explore")}
              </Link>
              <Link href={`/${currentLocale}/marketplace?tab=products`} className="hover:text-primary transition-colors">
                {t("products")}
              </Link>
              <Link href={`/${currentLocale}/marketplace?tab=services`} className="hover:text-primary transition-colors">
                {t("services")}
              </Link>
              <Link href={`/${currentLocale}/events`} className="hover:text-primary transition-colors">
                {t("events")}
              </Link>

              <div className="relative" ref={moreRef}>
                <button
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  onClick={() => setMoreOpen(!moreOpen)}
                  onMouseEnter={() => setMoreOpen(true)}
                >
                  {t("more")} <ChevronDown size={16} className={cn("transition-transform", moreOpen && "rotate-180")} />
                </button>

                {moreOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50" onMouseLeave={() => setMoreOpen(false)}>
                    {moreItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={`/${currentLocale}${item.href}`}
                        className={cn("block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-white", index === 0 && "rounded-t-lg", index === moreItems.length - 1 && "rounded-b-lg")}
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Sidebar (Mobile Menu) */}
        <div className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={closeMobileMenu}>
          <aside
            className={cn(
              "fixed top-0 h-full w-80 bg-background shadow-xl transform transition-transform duration-300 flex flex-col",
              currentLocale === "ar" ? "left-0" : "right-0",
              isOpen ? "translate-x-0" : currentLocale === "ar" ? "-translate-x-full" : "translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-grey-5">
              <Image src="/Logo.png" alt="Offerly Logo" width={100} height={30} className="object-contain" />
              <button onClick={closeMobileMenu}>
                <X size={24} className="text-primary" />
              </button>
            </div>

            <div className="flex-shrink-0 p-4 border-b border-grey-5">
              <SearchBar />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <nav className="flex flex-col pt-2 px-6 text-normal-regular text-color-grey-2">
                <Link href={`/${currentLocale}/`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("home")}
                </Link>
                <Link href={`/${currentLocale}/offers`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("offers")}
                </Link>
                <Link href={`/${currentLocale}/flashdeals`} className="flex items-center gap-1 text-tertiary font-semibold hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  ⚡ {t("flashDeals")}
                </Link>
                <Link href={`/${currentLocale}/explore`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("explore")}
                </Link>
                <Link href={`/${currentLocale}/marketplace?tab=products`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("products")}
                </Link>
                <Link href={`/${currentLocale}/marketplace?tab=services`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("services")}
                </Link>
                <Link href={`/${currentLocale}/events`} className="hover:text-primary transition-colors py-1.5" onClick={closeMobileMenu}>
                  {t("events")}
                </Link>

                <div className="pt-0 ">
                  <button className="flex items-center justify-between w-full text-normal-regular text-color-grey-2 hover:text-primary transition-colors py-2" onClick={() => setMoreModalOpen(true)}>
                    {t("more")}
                    <ChevronDown size={16} />
                  </button>
                </div>
              </nav>

              <div className="h-4"></div>
            </div>

            <div className="flex-shrink-0 flex flex-col gap-3 px-1 py-4 border-t border-grey-5 bg-background">
              <Button variant="outline" size="lg" className="flex items-center gap-2 justify-center min-h-[40px]">
                <Download size={16} />
                {t("app")}
              </Button>
              <Link href={`/${currentLocale}/auth`}>
              <Button variant="normal" size="lg" className="flex w-full items-center gap-2 justify-center min-h-[40px]" onClick={closeMobileMenu}>
                {t("login")}
              </Button>
              </Link>
              <Link href={`/${currentLocale}/auth`}>

              <Button variant="gradient" size="lg" className="flex w-full items-center gap-2 justify-center text-white min-h-[40px]" onClick={closeMobileMenu}>
                {t("signup")}
              </Button>
              </Link>
            </div>
          </aside>
        </div>

        {/* More modal (mobile) */}
        {moreModalOpen && (
          <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={closeMoreModal}>
            <div className="fixed inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <div className={cn("bg-background rounded-2xl shadow-2xl border border-border w-full max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100 max-h-[80vh] overflow-hidden", "animate-in slide-in-from-bottom-4 fade-in-0")}>
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-grey-5">
                  <h3 className="text-lg font-semibold text-foreground">{t("more")}</h3>
                  <button onClick={closeMoreModal} className="p-1 rounded-full hover:bg-grey-5 transition-colors">
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto">
                  {moreItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={`/${currentLocale}${item.href}`}
                      className={cn("flex items-center w-full px-4 py-3 text-sm transition-all duration-200", "hover:bg-primary/10 hover:text-primary rounded-lg mx-2 my-1", "border-l-2 border-transparent hover:border-primary")}
                      onClick={() => {
                        closeMoreModal();
                        closeMobileMenu();
                      }}
                    >
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown size={16} className="rotate-[-90deg] text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}