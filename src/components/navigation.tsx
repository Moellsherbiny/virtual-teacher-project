"use client"

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, BookOpen, Home, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navigation() {
  const t = useTranslations('course.navigation')
  const locale = useLocale()
  const { setTheme, theme } = useTheme()

  return (
    <nav className="border-b bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={`/${locale}`} className="text-2xl font-bold text-orange-500">
              EduPlatform
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href={`/${locale}`} className="flex items-center gap-2 text-navy-700 dark:text-gray-200 hover:text-orange-500">
                <Home size={18} />
                {t('home')}
              </Link>
              <Link href={`/${locale}/courses`} className="flex items-center gap-2 text-navy-700 dark:text-gray-200 hover:text-orange-500">
                <BookOpen size={18} />
                {t('courses')}
              </Link>
              <Link href={`/${locale}/profile`} className="flex items-center gap-2 text-navy-700 dark:text-gray-200 hover:text-orange-500">
                <User size={18} />
                {t('profile')}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {locale === 'en' ? '🇬🇧 EN' : '🇸🇦 AR'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/en">🇬🇧 English</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ar">🇸🇦 العربية</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}