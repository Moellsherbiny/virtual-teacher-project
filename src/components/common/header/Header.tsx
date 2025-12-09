"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import LocaleSwitcher from "../LocaleSwitcher"
import { ModeToggle } from "../Mode-toggle"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/apiHandler"
import { User } from "next-auth"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const t = useTranslations('navbar');
  const pathname = usePathname()
  const locale = useLocale()

  let links = [
    { href: "/", label: t('home') },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]
  if (user){
    links.push(
      { href: "/courses", label: t("courses") },
      { href: "/my-courses", label: t("my_courses") },
      { href: "/feedbacks", label: t("feedbacks") },
      
    )
  }
  useEffect(() => {
    const getUser = async () => {
      try{
        const data = await axiosInstance.get('/user')
        console.log(data)
        setUser(data.data.user)
      }catch(err){
        console.log(err)
      }
    }
    getUser();
  }, [])
  return (
    <header className="sticky top-0 bg-white/50 dark:bg-white/5 backdrop-blur-lg  z-[50]">
      <div className="container flex h-16 items-center justify-between">
        {/* LEFT: Nav Links (Desktop) */}
        <nav className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>


        <Sheet >
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={locale === "en" ? "left" : "right"} className="flex flex-col space-y-4">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/auth/signin">
                {t('signin')}
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/auth/signup">
                {t('signup')}
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
        <div className="flex items-center  gap-2">
          <ModeToggle />
          <LocaleSwitcher initialLocale={locale} />
        </div>
      </div>
    </header>
  )
}
