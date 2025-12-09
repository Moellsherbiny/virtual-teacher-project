"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  id: string;
  title: string;
}

export default function CourseHeader({ id, title }: CourseHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Manage: {title}</h1>
      <div className="flex gap-2 mt-3">
        <Link href={`/admin/courses/${id}/lessons`}>
          <Button>Lessons</Button>
        </Link>
        <Link href={`/admin/courses/${id}/quizzes`}>
          <Button>Quizzes</Button>
        </Link>
      </div>
    </div>
  );
}
