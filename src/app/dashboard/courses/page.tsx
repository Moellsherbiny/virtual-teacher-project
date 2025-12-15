import db from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/");

  const courses = await db.course.findMany({
    where: { instructorId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true, // ← publicId من Cloudinary
      createdAt: true,
    },
  });

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link href="/dashboard/courses/create">
          <Button>New Course</Button>
        </Link>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          You haven’t created any courses yet.
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="overflow-hidden rounded-md border bg-white shadow-sm dark:bg-slate-900"
          >
            {/* Image */}
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                width={600}
                height={340}
                alt={course.title}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-muted-foreground dark:bg-slate-800">
                No image
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h2 className="line-clamp-2 font-semibold">
                {course.title}
              </h2>

              <Link href={`/dashboard/courses/${course.id}`}>
                <Button variant="outline" className="mt-4 w-full">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
