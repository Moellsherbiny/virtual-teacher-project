import { Home, Inbox, Calendar, Search, Settings } from 'lucide-react'
import React from 'react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

function TeacherMenu() {
  const t = useTranslations("dashboard.menu")
  const items = [
    {
      title: t("home"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
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

export default TeacherMenu
