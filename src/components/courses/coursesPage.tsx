"use client";
import { useEffect, useState } from "react";
import { CourseCard } from "@/components/courses/courseCard";
import axiosInstance from "@/lib/apiHandler";
import { FolderArchive } from "lucide-react";
import { Button } from "../ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty";
import Link from "next/link";

interface Course {
  course_id: number;
  title: string;
  description: string;
  field: string;
  course_image: string;
}

export default function CoursesPage({
  pageTitle,
  apiUrl,
  userId,
  isEnrolled = false,
}: {
  pageTitle: string;
  apiUrl: string;
  userId?: string;
  isEnrolled: boolean;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = !userId ? apiUrl : `${apiUrl}?userId=${userId}`;

        const response = await axiosInstance.get("courses");
        const data = await response.data;
        setCourses(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiUrl, userId]);



  if (courses.length === 0) {
    return (
      <Empty className="min-h-[80vh]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderArchive />
          </EmptyMedia>
          <EmptyTitle>لا توجد دورات متاحة</EmptyTitle>
          <EmptyDescription> </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard">
              العودة للرئيسية
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="container mx-auto p-8">
        <h1 className="text-xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          {pageTitle}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}>
              <CourseCard
                id={course.course_id}
                title={course.title}
                image={course.course_image}
                description={course.description}
                isEnrolled={isEnrolled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}