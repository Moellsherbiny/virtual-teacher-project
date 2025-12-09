import UserMenu from '@/components/common/header/userMenu';
import { AppSidebar } from '@/components/dashboard/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';
import  { ReactNode } from 'react'
async function Layout({children}:{children:ReactNode}) {
  const sesstion = await auth();
  if (!sesstion) return redirect("/")
  const user = sesstion.user;
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className='flex flex-col w-full p-4 min-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center w-full'>
          <SidebarTrigger />
          <UserMenu user={{name:user.name!,image:user.image || ""}} />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
