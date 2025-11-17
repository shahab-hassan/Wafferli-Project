"use client";
import Navbar from "@/components/common/navbar";
import NavbarAfterLogin from "@/components/common/navbar-after-login";
import { useSelector } from "react-redux";

export default function NavbarAuth() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  return isAuthenticated ? <NavbarAfterLogin /> : <Navbar />;
}
