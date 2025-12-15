import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LessonForm } from "@/components/dashboard/course/lesson/lesson-form";


interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function CreateLessonPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const {moduleId} = await params
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">Create Lesson</h1>
      <LessonForm lesson={null} moduleId={moduleId} />
    </div>
  );
}
