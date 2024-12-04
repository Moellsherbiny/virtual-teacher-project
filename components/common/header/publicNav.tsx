"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/Mode-toggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header
      className="sticky top-0 bg-white/50 dark:bg-white/5 backdrop-blur-lg py-2  z-[50]"
      dir="rtl"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex">
          <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-blue-300">
            الروبوت التعليمي
            <br />
            الافـــــــتراضــــــــي
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
          <ModeToggle />
          <Link href="/about">
            <Button variant="ghost" onClick={toggleMenu}>
              من أنا
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button onClick={toggleMenu}>تسجيل الدخول</Button>
          </Link>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col space-y-4 px-8 md:hidden">
          <ModeToggle />

          <Link href="/about">
            <Button variant="ghost" className="w-full" onClick={toggleMenu}>
              حول التطبيق
            </Button>
          </Link>
          <Link href="/api/auth/signin">
            <Button className="w-full" onClick={toggleMenu}>
              تسجيل الدخول
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
