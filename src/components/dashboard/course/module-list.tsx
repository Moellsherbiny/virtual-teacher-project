"use client";

import { useEffect, useState } from "react";
import { Grip, Pencil, PlusCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


interface ModuleListProps {
  items: any[];
  courseId: string;
}

export const ModuleList = ({ items, courseId }: ModuleListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between font-medium">
        Course Modules
        <Button
          variant="ghost"
          onClick={() =>
            router.push(`/dashboard/courses/${courseId}/modules/new`)
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No modules found. Start by creating one!
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        {items.map((module) => (
          <div
            key={module.id}
            className="rounded-md border bg-white dark:bg-slate-800"
          >
            {/* Module Row */}
            <div className="flex items-center gap-x-2 border-b px-2 py-2">
              <div className="cursor-grab rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
                <Grip className="h-5 w-5" />
              </div>

              <div className="flex-1 truncate font-medium">
                {module.title}
              </div>

              <div className="flex items-center gap-x-1">
                {/* Add Lesson */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    router.push(
                      `/dashboard/modules/${module.id}/lessons/create`
                    )
                  }
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Lesson
                </Button>

                {/* Edit Module */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    router.push(
                      `/dashboard/courses/${courseId}/modules/${module.id}`
                    )
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lessons */}
            <div className="space-y-1 p-2">
              {module.lessons?.length === 0 && (
                <p className="pl-10 text-xs text-muted-foreground">
                  No lessons yet
                </p>
              )}

              {module.lessons?.map((lesson: any) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />

                  <span className="flex-1 truncate">
                    {lesson.title}
                  </span>

                  {/* Edit Lesson */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      router.push(
                        `/dashboard/lessons/${lesson.id}/edit`
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
