import { Home, Inbox, Search, Settings, Users } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function AdminMenu() {
  const t = useTranslations("dashboard.menu")
  const items = [
    {
      title: t("home"),
      url: "/dashboard",
      icon: Home,
    },

    {
      title: t("users"),
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: t("courses"),
      url: "/dashboard/courses",
      icon: Inbox,
    },
    {
      title: t("quizzes"),
      url: "/dashboard/quizzes",
      icon: Search,
    },
    {
      title: t("settings"),
      url: "/dashboard/profile",
      icon: Settings,
    },
  ]

  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
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

export default AdminMenu
