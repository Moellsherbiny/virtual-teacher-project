"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronRight, CheckCircle, PlayCircle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Instructor {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  instructor: Instructor;
  modules: Module[];
  completedLessons: string[];
}

export default function StudyCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/student/courses/${id}/study`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch");
        }

        const data = await res.json();
        // Ensure completedLessons exists
        data.completedLessons = Array.isArray(data.completedLessons)
          ? data.completedLessons
          : [];
        // Ensure modules and lessons exist
        data.modules = Array.isArray(data.modules) ? data.modules : [];
        data.modules.forEach((m: Module) => {
          m.lessons = Array.isArray(m.lessons) ? m.lessons : [];
        });

        setCourse(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 w-full">
        <Skeleton className="w-full h-60 mb-6" />
        <Skeleton className="h-8 w-1/2 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-5 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-xl font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Course not found.
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0
  );

  const completed = course.completedLessons.length || 0;

  const progress =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  const nextLesson =
    course.modules
      .flatMap((m) => m.lessons || [])
      .find((l) => !course.completedLessons.includes(l.id)) ||
    course.modules[0]?.lessons[0];

  return (
    <div className="p-6 w-full mx-auto">
      {course.imageUrl && (
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={1200}
          height={400}
          className="w-full h-60 object-cover rounded-2xl mb-6"
        />
      )}

      <h1 className="text-4xl font-bold">{course.title}</h1>
      <p className="text-muted-foreground mt-1">
        By {course.instructor?.name || "Unknown"}
      </p>

      {/* Progress */}
      {totalLessons > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-xl">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            {completed} of {totalLessons} lessons completed
          </p>

          {nextLesson && (
            <Button className="w-full mt-4" asChild>
              <a href={`/courses/${course.id}/lesson/${nextLesson.id}`}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Learning
              </a>
            </Button>
          )}
        </div>
      )}

      <Separator className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Course Content</h2>

      {course.modules.length === 0 && (
        <p className="text-center text-gray-500">No modules available.</p>
      )}

      {course.modules.map((module) => {
        const isOpen = expanded === module.id;

        return (
          <Card key={module.id} className="mb-4 shadow-sm border">
            <CardHeader
              className="cursor-pointer flex flex-row justify-between items-center"
              onClick={() => setExpanded(isOpen ? null : module.id)}
            >
              <CardTitle className="text-lg flex items-center gap-2">
                {isOpen ? <ChevronDown /> : <ChevronRight />}
                {module.title}
              </CardTitle>
            </CardHeader>

            {isOpen && (
              <CardContent className="space-y-3">
                {module.lessons.length === 0 && (
                  <p className="text-sm text-gray-500">No lessons in this module.</p>
                )}
                {module.lessons.map((lesson) => {
                  const isDone = course.completedLessons.includes(lesson.id);

                  return (
                    <a
                      key={lesson.id}
                      href={`/courses/${course.id}/lesson/${lesson.id}`}
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-accent transition"
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <PlayCircle className="text-primary" />
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>

                      {isDone && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                          Completed
                        </span>
                      )}
                    </a>
                  );
                })}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
