"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/apiHandler";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import Loader from "@/components/common/Loader";

// types/course.ts
export interface Course {
  course_id: string;
  title: string;
  course_image: string;
  description: string;
}

// Enhanced hook for enrollment
const useEnrollment = (courseId: string, userId: string) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();

  const handleEnroll = async () => {
    if (!courseId || !userId) {
      toast({
        title: "خطأ",
        description: "بيانات الدورة أو المستخدم غير متوفرة",
        variant: "destructive",
      });
      return;
    }

    setIsEnrolling(true);

    try {
      const { data, status } = await axiosInstance.post(
        "/courses/enrollments",
        {
          userId,
          courseId,
        }
      );

      if (status === 409) {
        toast({
          title: "خطأ",
          description: "انت منضم بالفعل",
          variant: "destructive",
        });
      }
      if (status === 201) {
        toast({
          title: "تم بنجاح",
          description: data.message,
        });
      } else {
        throw new Error(data.message || "فشل الانضمام للدورة");
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.status === 409 && "انت منضم بالفعل"
          : "فشل الانضمام للدورة. حاول مرة أخرى لاحقًا.";

      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return { handleEnroll, isEnrolling };
};

export default function CourseDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleEnroll, isEnrolling } = useEnrollment(params.id, userId);

  // Fetch course details when the component mounts
  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get<{ course: Course[] }>(
          `/courses/course?courseId=${params.id}`
        );
        if (!res.data || !res.data.course || res.data.course.length === 0) {
          throw new Error("لم يتم العثور على بيانات الدورة");
        }
        setCourse(res.data.course[0]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل بيانات الدورة"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseDetails();
  }, [params.id]);

  // Render loading state
  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  // Render error state
  if (error) {
    return <div className="text-red-500">خطأ: {error}</div>;
  }

  // Render if no course data is available
  if (!course) {
    return <div>لم تتوفر بيانات الدورة.</div>;
  }

  // Render course details
  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="order-1">
        <Image
          src={`/images/courses/${course.course_image}`}
          alt={course.title}
          width={600}
          height={400}
          className="rounded-lg w-full h-auto object-cover"
        />
      </div>
      <Card className="order-2">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex justify-start">
            <Button onClick={handleEnroll} disabled={isEnrolling}>
              {isEnrolling ? (
                <>
                  <Loader />
                  جاري الانضمام...
                </>
              ) : (
                "انضم الآن"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton loader for course details page
function CourseDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="order-2">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
      <div className="order-1">
        <Skeleton className="h-[200px] lg:h-[400px] w-full mb-4" />
      </div>
    </div>
  );
}
