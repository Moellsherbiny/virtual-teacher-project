import { Home, Inbox, Calendar, Search, Settings } from 'lucide-react'
import React from 'react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function StudentMenu() {
    const t = useTranslations("dashboard.menu")
  const items = [
    {
      title: t("home"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t("courses"),
      url: "/courses",
      icon: Inbox,
    },
    {
      title: t("my-courses"),
      url: "/dashboard/my-courses",
      icon: Inbox,
    },
    {
      title: t("quizzes"),
      url: "/quizzes",
      icon: Calendar,
    },
    {
      title: t("settings"),
      url: "/dashboard/profile",
      icon: Settings,
    },
  ]
  
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default StudentMenu
