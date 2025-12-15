import db from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LessonForm } from "@/components/dashboard/course/lesson/lesson-form";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function EditLessonPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const {lessonId} = await params;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      videoUrl: true,
      fileUrl: true,
      moduleId: true,
    },
  });

  if (!lesson) redirect("/");

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
      <LessonForm lesson={lesson} moduleId={lesson.moduleId} />
    </div>
  );
}
