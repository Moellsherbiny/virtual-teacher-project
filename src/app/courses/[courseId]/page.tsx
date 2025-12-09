"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { BookOpen, ChevronDown, ChevronRight, CheckCircle, PlayCircle } from "lucide-react";
import api from "@/lib/apiHandler";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// --- Types ---
export type Lesson = {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  order?: number;
  isCompleted?: boolean;
};

export type Module = {
  id: string;
  title: string;
  order?: number;
  lessons: Lesson[];
};

export type Instructor = {
  id: string;
  name: string;
};

export type StudentCourseDetails = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  instructor: Instructor;
  modules: Module[];
  enrollments: any[];
  isEnrolled?: boolean;
};

// --- Main Component ---
export default function CourseDetailsPage() {
  const t = useTranslations("studentCourses.CourseDetails");
  const params = useParams();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId as string | undefined;

  const [course, setCourse] = useState<StudentCourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);

  // --- Fetch Course ---
  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const result = await api.get(`/courses/${courseId}`);
        const data: StudentCourseDetails = {
          ...result.data,
          isEnrolled: result.data.enrollments?.length > 0,
        };
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // --- Set First Lesson ---
  useEffect(() => {
    if (course && course.modules.length > 0 && !activeLesson) {
      const firstModule = course.modules.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
      const firstLesson = firstModule?.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
      if (firstLesson) setActiveLesson({ moduleId: firstModule.id, lessonId: firstLesson.id });
    }
  }, [course, activeLesson]);

  // --- Enrollment ---
  const handleEnroll = async () => {
    if (!course || !courseId) return;
    try {
      await api.post(`student/enrollments`,{courseId});
      setCourse({ ...course, isEnrolled: true });
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  // --- Mark Lesson Complete ---
  const handleMarkComplete = (lessonId: string) => {
    if (!course) return;
    const updatedCourse = { ...course };
    updatedCourse.modules = updatedCourse.modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
      )
    }));
    setCourse(updatedCourse);
  };

  // --- Go to First Lesson ---
  const goToFirstLesson = () => {
    if (course && course.modules.length > 0) {
      const firstModule = course.modules.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
      const firstLesson = firstModule?.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
      if (firstLesson) setActiveLesson({ moduleId: firstModule.id, lessonId: firstLesson.id });
    }
  };

  // --- Loading State ---
  if (isLoading || !courseId) {
    return (
      <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Skeleton className="h-16 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
        <div className="flex space-x-6">
          <Skeleton className="h-[600px] w-2/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-[600px] w-1/3 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // --- Not Found ---
  if (!course) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-red-600">Course Not Found</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300">The course with ID "{courseId}" could not be loaded.</p>
      </div>
    );
  }

  const currentModule = course.modules.find(m => m.id === activeLesson?.moduleId);
  const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson?.lessonId);

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="mb-6 bg-blue-950 dark:bg-gray-800 p-6 rounded-lg text-white shadow-xl flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold">{course.title}</h1>
          <p className="text-sm opacity-80 mt-1">{t("instructorLabel")}: {course.instructor.name}</p>
        </div>

        {!course.isEnrolled && (
          <Button onClick={handleEnroll} className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold">
            {t("enrollNow")}
          </Button>
        )}
        {course.isEnrolled && (
          <Button onClick={goToFirstLesson} asChild className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold">
           <Link href={`/dashboard/my-courses/${courseId}`}>
            <PlayCircle className="h-5 w-5 me-2" /> {t("goToCourse")}
           </Link>
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Lesson Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-gray-800 p-4 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-950 dark:text-gray-100 mb-3">
              {currentLesson?.title || t("selectLesson")}
            </h2>
            <Separator className="dark:bg-gray-700 mb-4" />

            {currentLesson?.videoUrl && (
              <div className="relative aspect-video bg-black rounded-lg mb-4 flex items-center justify-center text-white text-xl">
                {t("videoPlaceholder")}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {currentLesson?.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              ) : (
                <p className="text-center py-10 text-gray-500">{t("noContent")}</p>
              )}
            </div>

            {course.isEnrolled && currentLesson && !currentLesson.isCompleted && (
              <div className="mt-6 text-end">
                <Button onClick={() => handleMarkComplete(currentLesson.id)} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold">
                  <CheckCircle className="h-5 w-5 me-2" /> {t("markComplete")}
                </Button>
              </div>
            )}
            {course.isEnrolled && currentLesson?.isCompleted && (
              <div className="mt-6 text-end">
                <Badge className="bg-gray-500 dark:bg-gray-600 text-white text-md py-1 px-3">
                  <CheckCircle className="h-4 w-4 me-2" /> {t("completed")}
                </Badge>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="dark:bg-gray-800 p-4 shadow-lg sticky top-4">
            <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 border-b pb-2 dark:border-gray-700">
              <BookOpen className="h-5 w-5 inline me-2" /> {t("curriculum")}
            </h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {course.modules.map((module) => (
                <Collapsible key={module.id} defaultOpen={course.isEnrolled}>
                  <CollapsibleTrigger asChild>
                    <div className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${activeLesson?.moduleId === module.id ? "bg-orange-100 dark:bg-orange-950" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"}`}>
                      <span className="font-semibold text-blue-950 dark:text-gray-100 line-clamp-1">
                        {module.title}
                      </span>
                      {activeLesson?.moduleId === module.id ? <ChevronDown className="h-5 w-5 text-orange-600" /> : <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ps-2">
                    {module.lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => course.isEnrolled && setActiveLesson({ moduleId: module.id, lessonId: lesson.id })}
                        className={`flex items-center p-2 rounded-lg text-sm transition-colors ${course.isEnrolled ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-default opacity-70'} ${activeLesson?.lessonId === lesson.id ? 'bg-orange-50 dark:bg-orange-900 font-medium text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {lesson.isCompleted ? <CheckCircle className="h-4 w-4 me-2 text-green-600" /> : <PlayCircle className="h-4 w-4 me-2 text-gray-500 dark:text-gray-400" />}
                        <span className="line-clamp-1">{lesson.title}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
