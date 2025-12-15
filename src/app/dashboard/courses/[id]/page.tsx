import db  from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseForm } from "@/components/dashboard/course/course-form"; // You would extract the form logic here
import { ModuleList } from "@/components/dashboard/course/module-list"; // Component to list modules

export default async function CourseIdPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth();
  const {id} = await params;
  const userId = session?.user?.id;
  if (!userId) return redirect("/");
const course = await db.course.findUnique({
    where: { id, instructorId: userId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) return redirect("/");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Setup</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Course Details */}
        <div>
           <CourseForm initialData={course} courseId={course.id} />
        </div>

        {/* Right Col: Modules */}
        <div>
           {/* We pass a client-side redirect function or handle it in the component */}
           <ModuleList 
              items={course.modules} 
              courseId={course.id}
            />
        </div>
      </div>
    </div>
  );
}