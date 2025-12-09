"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, BookOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import api from "@/lib/apiHandler";
import { Course } from "@/types/course"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

// Import the dedicated form component
import { EditCourseForm } from "@/components/dashboard/course/EditCourseForm"; 
import { ModulesAndLessonsManager } from "@/components/dashboard/course/ModulesAndLessonsManager";

// Define the expected props from Next.js dynamic routing
interface EditCoursePageProps {
  params: Promise<{id: string}>;
  
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  
  const t = useTranslations("dashboard.EditCoursePage");
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch the course details
  const fetchCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      const {id} = await params;
      const result = await api.get(`/admin/course/${id}`);
      setCourse(result.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast({
        title: t("toast.fetchError"),
        description: t("toast.fetchErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Handler to refresh data after the main form is submitted
  const handleCourseUpdated = () => {
    fetchCourse();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4 p-4 md:p-8">
        <h1 className="text-3xl font-extrabold text-red-600">{t("notFound")}</h1>
        <p>{t("notFoundMessage")}</p>
        <Link href="/dashboard/courses" passHref>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToManagement")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b">
        <h1 className="text-3xl font-extrabold flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            {t("header")} - {course.title}
        </h1>
        <Link href="/dashboard/courses" passHref>
          <Button variant="outline" className="mt-4 sm:mt-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToManagement")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Course Details Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                {t("formCardTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pass the course data and update handler to the form */}
              <EditCourseForm course={course} onCourseUpdated={handleCourseUpdated} />
            </CardContent>
          </Card>

          {/* Additional Info Card (e.g., Image Upload, Settings) */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settingsCardTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("settingsPlaceholder")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Modules and Lessons Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("modulesCardTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ModulesAndLessonsManager courseId={course.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}