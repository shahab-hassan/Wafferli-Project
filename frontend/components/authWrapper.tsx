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

  console.log(
    "AuthWrapper: isAuthenticated =",
    isAuthenticated,
    "user =",
    user
  );
  //  Protect these routes
  const protectedRoutes = [
    "/en/chat",
    "/en/become-seller",
    "/ar/settings",
    "/en/my-wallet",
    "/en/all-my-ads",
    // Arabic
    "/ar/become-seller",
    "/ar/chat",
    "/ar/settings",
    "/en/my-wallet",
    "/en/all-my-ads",
    ,
  ];

  //  Auth pages (never redirect from here)
  const publicPrefixes = ["/en/auth", "/ar/auth"];

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    const isPublic = publicPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    const isArabic = pathname.startsWith("/ar");

    // ✅ Public route → skip auth check
    if (isPublic) {
      setAuthChecked(true);
      return;
    }

    // ✅ No token and trying to access protected route → redirect
    if (isProtected && !token) {
      router.replace(isArabic ? "/ar/auth" : "/en/auth");
      return;
    }

    // ✅ If already authenticated → skip API call
    if (isAuthenticated) {
      console.log("✅ Already authenticated, skipping CheckAuth API");
      setAuthChecked(true);
      return;
    }

    // ✅ Token exists but not verified yet → call CheckAuth once
    if (token) {
      console.log("🔍 First-time auth check...");

      dispatch(CheckAuth() as any)
        .unwrap()
        .then((res: any) => {
          console.log("✅ Auth success:", res);
          setAuthChecked(true);
        })
        .catch((err: any) => {
          console.log("❌ Auth failed:", err);

          const statusCode =
            err?.statusCode ||
            err?.response?.status ||
            err?.status ||
            err?.code ||
            null;

          if (statusCode === 401 || statusCode === 403) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("hasAuthChecked");

            if (isProtected) {
              router.replace(isArabic ? "/ar/auth" : "/en/auth");
            } else {
              setAuthChecked(true);
            }
          } else {
            console.warn("⚠️ Network issue, token preserved.");
            setAuthChecked(true);
          }
        });
    } else {
      setAuthChecked(true);
    }
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
