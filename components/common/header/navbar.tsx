"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/common/Mode-toggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header className="bg-background py-4 px-6" dir="rtl">
      <div className="flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold">المعلم الافتراضي</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
          <ModeToggle />
          {session ? (
            <>
              <Link href="/chat">
                <Button variant="ghost">الدردشة مع المعلم</Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/about">
                <Button variant="ghost">حول التطبيق</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>تسجيل الدخول</Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col space-y-4 md:hidden">
          <ModeToggle />
          {session ? (
            <>
              <Link href="/chat">
                <Button variant="ghost" className="w-full">
                  الدردشة مع المعلم
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="w-full">
                  الملف الشخصي
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" className="w-full">
                  الإعدادات
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost" className="w-full">
                  تسجيل الخروج
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/about">
                <Button variant="ghost" className="w-full">
                  حول التطبيق
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button className="w-full">تسجيل الدخول</Button>
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

function UserMenu() {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session.data?.user?.image as string} />
          <AvatarFallback>{session.data?.user?.name as string}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/profile">الملف الشخصي</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">الإعدادات</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/api/auth/signout">تسجيل الخروج</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
