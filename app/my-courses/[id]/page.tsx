"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/apiHandler";
import Loader from "@/components/common/Loader";

interface Lesson {
  lesson_id: number;
  course_id: number;
  title: string;
  content: string;
}

export default function CourseLessons({ params }: { params: { id: string } }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/courses/my-courses/${params.id}/lessons`
        );
        setLessons(data.lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/my-courses">
            <ArrowRight className="ml-2 h-4 w-4" />الرجوع الي دوراتي 
          </Link>
        </Button>
        <h1 className="text-xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          موضوعات الدورة التعليمية
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card
              key={lesson.lesson_id}
              className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="ml-2 p-4 text-center rounded-md bg-gradient-to-br from-purple-950 to-blue-600">
                    <BookOpen size="lg" className="mx-auto font-bold text-lg text-white h-5 w-5" />
                  </div>
                  <span className="text-base">{lesson.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {lesson.content}
                </p>
                <Button asChild className="w-full">
                  <Link
                    href={`/my-courses/${params.id}/lessons/${lesson.lesson_id}`}
                  >
                    البدأ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
