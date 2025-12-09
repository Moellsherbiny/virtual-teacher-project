"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Logo from "../Logo";

export default function Header() {
  const t = useTranslations("navbar");
  return (
    <header  className="py-2">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/auth/signin">
            <Button className="px-8" >{t("signin")}</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="px-8" variant="outline" >{t("signup")}</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
