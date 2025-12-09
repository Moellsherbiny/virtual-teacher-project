"use client";
import { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
// Components
import { Button } from "../ui/button";
import { ModeToggle } from "./Mode-toggle";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNavbar from "./mobileNavbar";
import NavLinks from "./NavLinks";
// Utility
import { axiosInstance } from "@/lib/apiHandler";
import { Skeleton } from "../ui/skeleton"; // Assuming you have a Skeleton component for loading states
import {  ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";

// Define the shape of the session data you expect
interface SessionData {
  authenticated: boolean;
}


export default function Navbar() {
  const session = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale()

  // Add a clear loading state for the desktop navigation elements
  const desktopAuthControls = (
    <div className="hidden lg:flex items-center gap-2">
      <ModeToggle />
      <LocaleSwitcher initialLocale={locale} />
      
       {!session.data?.user ? (
        // Show Login/Signup when not authenticated
        <div className="hidden sm:flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">{t("getStarted")}</Link>
          </Button>
        </div>
      ) : (
           
        <Button variant="default" className="bg-orange-600 hover:bg-orange-700 focus:scale-95" asChild>
          <Link href="/dashboard">
          {t("dashboard")} <ArrowUpRight size={16}/></Link>
        </Button>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-950/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex">
          {/* Note: It's good you're passing isAuth to NavLinks, as it handles link visibility */}
          <NavLinks />
        </div>

        {/* Desktop Controls (Toggle, Locale, Auth Buttons) */}
        {desktopAuthControls}

        {/* Mobile Navigation */}
        <MobileNavbar isAuth={!!session.data?.user}  />
      </div>
    </header>
  );
}