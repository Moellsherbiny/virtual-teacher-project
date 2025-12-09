import { Home, Inbox, Calendar, Search, Settings } from 'lucide-react'
import React from 'react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'
import Link from 'next/link'

function StudentMenu() {
  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: Inbox,
    },
    {
      title: "my-courses",
      url: "/dashboard/my-courses",
      icon: Inbox,
    },
    {
      title: "quizzes",
      url: "/dashboard/quizzes",
      icon: Calendar,
    },
    {
      title: "Results",
      url: "/dashboard/results",
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

export default StudentMenu
