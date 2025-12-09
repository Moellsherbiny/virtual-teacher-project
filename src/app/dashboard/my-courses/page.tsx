"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Lesson {
  id: string;
}

interface Module {
  id: string;
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
  _count: {
    enrollments: number;
  };
}

interface Enrollment {
  id: string;
  course: Course;
  createdAt: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/student/enrollments", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setCourses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-2xl shadow-sm">
            <Skeleton className="w-full h-40" />
            <CardHeader>
              <Skeleton className="w-1/2 h-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-3/4 h-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <p className="text-xl font-semibold">No Courses Found</p>
        <p className="text-muted-foreground">Enroll in a course to see it here.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((enrollment) => {
          const course = enrollment.course;
          const totalLessons = course.modules.reduce(
            (sum, m) => sum + m.lessons.length,
            0
          );

          return (
            <Card key={course.id} className="rounded-2xl overflow-hidden shadow-sm">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={600}
                  height={300}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-muted" />
              )}

              <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  By {course.instructor?.name}
                </p>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">
                  {totalLessons} total lessons
                </div>

                <Separator className="my-3" />

                <Button className="w-full" asChild>
                  <a href={`/courses/${course.id}`}>Continue Course</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
