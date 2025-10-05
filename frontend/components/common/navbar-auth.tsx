"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Import for query params
import Navbar from "@/components/common/navbar";
import NavbarAfterLogin from "@/components/common/navbar-after-login";
import { useIsLogin } from "@/contexts/isLoginContext";

export default function NavbarAuth() {
  const searchParams = useSearchParams();
  const { isLogin, setIsLogin } = useIsLogin();

  useEffect(() => {
    if (searchParams?.get("loggedin") === "true") {
      setIsLogin(true); // ✅ Set state if param is present
      console.log("NavbarAuth: Set isLogin from query param");
    }
  }, [searchParams, setIsLogin]);

  useEffect(() => {
    console.log("NavbarAuth: isLogin =", isLogin); // Debug log
  }, [isLogin]);

  return isLogin ? <NavbarAfterLogin /> : <Navbar />;
}