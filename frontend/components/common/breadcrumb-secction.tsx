//breadcrumb-section
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, MoreHorizontal, Home } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

interface BreadcrumbProps {
  items?: Crumb[];
  collapseFrom?: number;
  offsetTop?: number;
  showDivider?: boolean;
}

export default function Breadcrumb({
  items,
  collapseFrom = 4,
  showDivider = true,
}: BreadcrumbProps) {
  const pathname = usePathname() || "/";
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";

  const breadcrumbRef = useRef<HTMLDivElement | null>(null);
  const collapseRef = useRef<HTMLDivElement | null>(null);

  const [collapsedOpen, setCollapsedOpen] = useState(false);
  const [breadcrumbHeight, setBreadcrumbHeight] = useState(0);

  useEffect(() => {
    try {
      document.documentElement.setAttribute(
        "dir",
        locale === "ar" ? "rtl" : "ltr"
      );
    } catch {}
  }, [locale]);

  const defaultItems = useMemo(() => {
    const raw = pathname.split("/").filter(Boolean);
    if (raw[0] === "en" || raw[0] === "ar") raw.shift();

    const crumbs: Crumb[] = [];
    crumbs.push({
      label: locale === "ar" ? "الرئيسية" : "Home",
      href: `/${locale}/`,
    });

    let acc = `/${locale}`;
    raw.forEach((seg, i) => {
      const segmentHref = acc + `/${seg}`;
      let label = decodeURIComponent(seg).replace(/[-_]/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      let crumbHref = segmentHref;

      // Special handling for marketplace > product or service
      const prevSeg = i > 0 ? raw[i - 1] : null;
      if (prevSeg === "marketplace") {
        if (seg.toLowerCase() === "product") {
          label = locale === "ar" ? "المنتجات" : "Products";
          crumbHref = `${acc}?tab=products`;
        } else if (seg.toLowerCase() === "service") {
          label = locale === "ar" ? "الخدمات" : "Services";
          crumbHref = `${acc}?tab=services`;
        }
      }

      crumbs.push({
        label,
        href: crumbHref,
      });

      // Update acc to the actual path accumulation for the next segment
      acc = segmentHref;
    });

    return crumbs;
  }, [pathname, locale]);

  const crumbs = items && items.length > 0 ? items : defaultItems;

  const isHomePage = useMemo(() => {
    const cleanPathname = pathname.replace(/\/$/, "");
    return (
      cleanPathname === "" ||
      cleanPathname === `/${locale}` ||
      cleanPathname === "/en" ||
      cleanPathname === "/ar" ||
      crumbs.length === 1
    );
  }, [pathname, locale, crumbs]);

    const isChatPage = useMemo(() => {
    const cleanPathname = pathname.replace(/\/$/, "");
    return cleanPathname.endsWith("/chat");
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        collapseRef.current &&
        !collapseRef.current.contains(e.target as Node)
      ) {
        setCollapsedOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !breadcrumbRef.current) return;

    const breadcrumbEl = breadcrumbRef.current;
    const measureAll = () => {
      if (!breadcrumbEl) return;
      const rect = breadcrumbEl.getBoundingClientRect();
      setBreadcrumbHeight(rect.height);
    };

    const resizeObserver = new ResizeObserver(() => measureAll());
    resizeObserver.observe(breadcrumbEl);

    measureAll();
    const t = window.setTimeout(measureAll, 100);

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  if (isHomePage || isChatPage) return null;

  const shouldCollapse = crumbs.length > collapseFrom;
  const first = crumbs[0];
  const last = crumbs[crumbs.length - 1];
  const middle = shouldCollapse
    ? crumbs.slice(1, crumbs.length - 1)
    : crumbs.slice(1, -1);

  const breadcrumbContent = (
    <div
      className={cn(
        "max-w-[1440px] h-[40px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center z-102"
      )}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <nav aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}>
        <ol
          className={cn(
            "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base overflow-hidden",
            locale === "ar" ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Home / first */}
          <li className={cn("flex items-center gap-1 sm:gap-2 shrink-0")}>
            {first.href ? (
              <Link
                href={first.href}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
                title={first.label}
              >
                <Home
                  size={14}
                  className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
                />
                <span className="hidden sm:inline truncate">{first.label}</span>
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 text-primary"
                title={first.label}
              >
                <Home size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline truncate">{first.label}</span>
              </span>
            )}

            {showDivider && crumbs.length > 1 && (
              <ChevronRight
                size={12}
                className={cn(
                  "sm:w-4 sm:h-4 text-muted-foreground/60 shrink-0 transition-transform",
                  locale === "ar" && "rotate-180"
                )}
              />
            )}
          </li>

          {/* Collapsed middle */}
          {shouldCollapse ? (
            <li
              className="relative flex items-center gap-1 sm:gap-2 shrink-0"
              ref={collapseRef}
            >
              <button
                onClick={() => setCollapsedOpen((s) => !s)}
                aria-expanded={collapsedOpen}
                className="flex items-center gap-1 px-1.5 py-1 sm:px-2 rounded-md hover:bg-grey-5 transition-colors"
                title="Show hidden breadcrumb items"
              >
                <MoreHorizontal size={12} className="sm:w-4 sm:h-4" />
              </button>

              {showDivider && (
                <ChevronRight
                  size={12}
                  className={cn(
                    "sm:w-4 sm:h-4 text-muted-foreground/60 shrink-0 transition-transform",
                    locale === "ar" && "rotate-180"
                  )}
                />
              )}

              <AnimatePresence>
                {collapsedOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className={cn(
                      "absolute top-full mt-2 min-w-[160px] sm:min-w-[180px] max-w-[280px] sm:max-w-[320px] rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50",
                      locale === "ar" ? "right-0" : "left-0"
                    )}
                  >
                    <div className="p-1">
                      {middle.map((m, i) => (
                        <Link
                          key={m.href || i}
                          href={m.href || "#"}
                          onClick={() => setCollapsedOpen(false)}
                          className="block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm truncate hover:bg-primary/10 rounded-md transition-colors"
                        >
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ) : (
            // Render middle inline
            middle.map((m, i) => (
              <li
                key={(m.href || "mid-") + i}
                className="flex items-center gap-1 sm:gap-2 min-w-0"
              >
                {m.href ? (
                  <Link
                    href={m.href}
                    className="text-muted-foreground hover:text-primary transition-colors truncate text-xs sm:text-sm"
                    title={m.label}
                  >
                    {m.label}
                  </Link>
                ) : (
                  <span
                    className="text-muted-foreground truncate text-xs sm:text-sm"
                    title={m.label}
                  >
                    {m.label}
                  </span>
                )}

                {showDivider && (
                  <ChevronRight
                    size={12}
                    className={cn(
                      "sm:w-4 sm:h-4 text-muted-foreground/60 shrink-0 transition-transform",
                      locale === "ar" && "rotate-180"
                    )}
                  />
                )}
              </li>
            ))
          )}

          {/* Last / current */}
          {crumbs.length > 1 && (
            <li className="flex items-center min-w-0">
              <span
                aria-current="page"
                className="font-medium truncate text-xs sm:text-sm text-primary"
                title={last.label}
              >
                {last.label}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );

  return (
    <div
      ref={breadcrumbRef}
      className={cn(
        "w-full transition-all duration-300 ease-out py-2 z-10",
        "bg-background border-b border-grey-6 rounded-br-[20px] rounded-bl-[20px]"
      )}
      style={{
        marginBottom: breadcrumbHeight
          ? `-${Math.round(breadcrumbHeight / 3)}px`
          : undefined,
      }}
    >
      {breadcrumbContent}
    </div>
  );
}