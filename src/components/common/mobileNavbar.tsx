"use client";

import  { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton is available
import { ModeToggle } from "./Mode-toggle";
import LocaleSwitcher from "./LocaleSwitcher";

interface MobileNavbarProps {
  isAuth: boolean;
}

function MobileNavbar({ isAuth  }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("navbar");
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="outline" aria-label={t("menuButton")}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={locale === "ar" ? "left" : "right"}
        className="w-[280px] sm:w-[320px] flex flex-col" // slightly wider for better content fit
      >
        <SheetHeader className="pb-4">
          <SheetTitle>{t("brandName")}</SheetTitle>
          <SheetDescription>{t("subtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto">
          {/* NavLinks needs a mechanism to close the sheet on click. We'll rely on Link components' behavior. */}
          {/* We wrap NavLinks in a fragment and apply the onClick handler to the whole section for simplicity, 
              but ideally, the <Link> elements within NavLinks should handle closing the sheet. 
              Since we can't modify NavLinks here, we'll apply it to the surrounding context. */}
          <div onClick={handleLinkClick}>
            {/* 3. Added margin utility and flex-col for vertical stacking */}
            <NavLinks className="flex-col gap-4 text-base font-semibold" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          {!isAuth && (
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild onClick={handleLinkClick}>
                <Link href="/auth/login">
                  {t("login")}
                </Link>
              </Button>
              <Button asChild onClick={handleLinkClick}>
                <Link href="/auth/sign-up">
                  {t("getStarted")}
                </Link>
              </Button>
            </div>
          )}

          {/* Example: Add a user control link if authenticated */}
          {isAuth && (
            <Button variant="outline" asChild onClick={handleLinkClick}>
              <Link href="/dashboard">
                {t("dashboard")}
              </Link>
            </Button>
          )}
        </div>
        <hr />
        <div>

          <ModeToggle />
          <LocaleSwitcher initialLocale="en" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavbar;