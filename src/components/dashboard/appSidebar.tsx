import { Home, Settings, Search, LayoutDashboard } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth"; // Assuming this handles NextAuth/Lucia
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuItem } from "@/components/ui/sidebar";


import TeacherMenu from "./TeacherMenu"; 
import StudentMenu from "./StudentMenu";
import AdminMenu from "./AdminMenu";


type UserRole = "STUDENT" | "TEACHER" | "ADMIN";


export async function AppSidebar() {
  const lang = await getLocale();
  const t = await getTranslations('sidebar');
  const session = await auth();
  const user = session?.user;
  const userRole: UserRole | null = (user?.role as UserRole) ?? null;

  return (
    <Sidebar side={lang === "ar" ? "right" : "left"}>
      <SidebarContent>
        {/* Logo/Branding Space */}
        <div className="hidden md:flex h-12 items-center justify-center p-4">
          <span className="text-xl font-bold text-primary">LMS-App</span>
        </div>
        <div className="md:hidden h-2"></div> 
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>
            {t('userSpecific')} {/* Translation for USER-SPECIFIC */}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Conditional Rendering based on Role */}
            {userRole === "STUDENT" && <StudentMenu />}
            {userRole === "TEACHER" && <TeacherMenu />}
            {userRole === "ADMIN" && <AdminMenu />}
            
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}