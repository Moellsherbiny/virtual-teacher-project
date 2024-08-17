"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/common/header/userMenu";
import { ModeToggle } from "@/components/common/Mode-toggle";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface User {
  user: { name: string; image: string };
}
export default function Header({ user }: User) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header
      className="sticky top-0 bg-white/50 dark:bg-white/5 backdrop-blur-lg py-2 px-6 z-[50]"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex">
          <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-blue-300">
            المعــلــــم
            <br />
            الافتراضي
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
          <Link href="/chat">
            <Button variant="ghost">الدردشة مع المعلم</Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="w-full">
              الدورات التعليمية
            </Button>
          </Link>
          <Link href="/my-courses">
            <Button variant="ghost" className="w-full">
              دوراتي
            </Button>
          </Link>
          <Link href="/feedbacks">
            <Button variant="ghost" className="w-full">
              النتائج
            </Button>
          </Link>
          <ModeToggle />
          <UserMenu
            user={{
              name: user.name,
              image: user.image,
            }}
          />
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col space-y-4 md:hidden">
          <ModeToggle />
          <Link href="/chat">
            <Button variant="ghost" className="w-full">
              الدردشة مع المعلم
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="w-full">
              الدورات التعليمية
            </Button>
          </Link>
          <Link href="/my-courses">
            <Button variant="ghost" className="w-full">
              دوراتي
            </Button>
          </Link>
          <Link href="/feedbacks">
            <Button variant="ghost" className="w-full">
              النتائج
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full">
              الملف الشخصي
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => signOut()}
          >
            تسجيل الخروج
          </Button>
        </nav>
      )}
    </header>
  );
}
