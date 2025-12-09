import AdminHome from '@/components/dashboard/adminPage'
import StudentPage from '@/components/dashboard/StudentPage'
import TeacherPage from '@/components/dashboard/TeacherPage'
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function Page() {
  const session = await auth();
  const role = session?.user.role;
  if(role === undefined || role === null || role === "")
    redirect("/")
  return (
    <div>
      {role === "ADMIN" && <AdminHome />}
      {role === "TEACHER" && <TeacherPage />}
      {role === "STUDENT" && <StudentPage />}
    </div>
  )
}

export default Page
