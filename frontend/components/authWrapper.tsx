"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CheckAuth } from "@/features/slicer/AuthSlice";
import Loader from "./loader";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  //  Protect these routes
  const protectedRoutes = [
    "/en/chat",
    "/en/become-seller",
    "/en/settings",
    "/en/wishlist",
    "/en/wallet",
    "/en/contact",

    "/en/for-businesses",
    "/en/gift-card",

    // Arabic
    "/ar/chat",
    "/ar/become-seller",
    "/ar/settings",
    "/ar/wishlist",
    "/ar/wallet",
    "/ar/contact",

    "/ar/for-businesses",
    "/ar/gift-card",
  ];

  const sellerOnlyRoutes = [
    "/en/post-ad",
    "/en/edit-ad",
    "/en/all-my-ads",

    "/en/my-ads",
    "/en/boost-ad-listing",

    // Arabic
    "/ar/post-ad",
    "/ar/edit-ad",
    "/ar/all-my-ads",

    "/ar/my-ads",
    "/ar/boost-ad-listing",
  ];

  //  Auth pages (never redirect from here)
  const publicPrefixes = ["/en/auth", "/ar/auth"];

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    const isSellerRoute = sellerOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    const isPublic = publicPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    const isArabic = pathname.startsWith("/ar");

    // ✅ Public route → skip auth check
    if (isPublic && !token) {
      setAuthChecked(true);
      return;
    }

    // ✅ No token and trying to access protected route → redirect
    if ((isProtected || isSellerRoute) && !token) {
      router.replace(isArabic ? "/ar/auth" : "/en/auth");
      return;
    }

    // 🔁 Token exists but redux not hydrated
    if (token && !isAuthenticated) {
      dispatch(CheckAuth() as any)
        .unwrap()
        .then((res: any) => {
          const role = res?.data?.role;

          if (isSellerRoute && role !== "seller") {
            router.replace(
              isArabic ? "/ar/become-seller" : "/en/become-seller"
            );
            return;
          }

          setAuthChecked(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          router.replace(isArabic ? "/ar/auth" : "/en/auth");
        });

      return;
    }

    // 🔒 Already authenticated → role check
    if (isAuthenticated) {
      if (isSellerRoute && user?.role !== "seller") {
        router.replace(
          isArabic ? "/ar/become-seller" : "/en/become-seller"
        );
        return;
      }
    }

    setAuthChecked(true);

  }, [dispatch, pathname, router, isAuthenticated]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
