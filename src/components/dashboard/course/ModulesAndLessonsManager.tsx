"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  PlusCircle,
  BookOpen,
  FileText,
  GripVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import api from "@/lib/apiHandler";
import { CreateModuleModal } from "./CreateModuleModal";
// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// --- 1. Define Hierarchical Types ---

// A Lesson is nested inside a Module
export type Lesson = {
  id: string;
  title: string;
  isPublished: boolean;
  order: number;
  content?: string; // Content will be edited on a separate Lesson Edit page
};

// A Module holds multiple Lessons
export type Module = {
  id: string;
  title: string;
  isPublished: boolean;
  order: number;
  lessons: Lesson[];
};

interface ModulesAndLessonsManagerProps {
  courseId: string;
}

// --- 2. Main Component ---
export const ModulesAndLessonsManager: React.FC<ModulesAndLessonsManagerProps> = ({
  courseId,
}) => {
  const t = useTranslations("dashboard.ModulesManager");
  const { toast } = useToast();

  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);


  const fetchModules = async () => {
    setIsLoading(true);
    try {

      const result = await api.get(`/admin/course/${courseId}/module`);
      setModules(result.data.modules);
    } catch (error) {
      console.error("Error fetching course modules:", error);
      toast({
        title: t("toast.fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);



  // Toggle visibility of a module's lessons
  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // CRUD Handlers (currently just logging, actual implementation requires forms/modals)
  const handleAddModule = () => {
    setIsCreateModuleModalOpen(true);
  };

  const handleEditModule = (moduleId: string) => {
    console.log("Edit module:", moduleId);
    // TODO: Open Edit Module Modal/Form
  };

  const handleDeleteModule = (moduleId: string) => {
    console.log("Delete module:", moduleId);
    // TODO: Open Confirmation Dialog and handle API call
  };

  const handleAddLesson = (moduleId: string) => {
    console.log("Add lesson to module:", moduleId);
    // TODO: Open Create Lesson Modal/Form
  };

  const handleEditLesson = (lessonId: string) => {
    console.log("Edit lesson:", lessonId);
    // TODO: Navigate to /dashboard/courses/[courseId]/lessons/[lessonId]
  };

  const handleDeleteLesson = (lessonId: string) => {
    console.log("Delete lesson:", lessonId);
    // TODO: Open Confirmation Dialog and handle API call
  };

  // --- 5. Loading State & Empty State ---
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4 border border-dashed rounded-lg bg-muted/50">
        <BookOpen className="w-10 h-10 text-muted-foreground" />
        <p className="text-lg font-semibold text-muted-foreground">{t("emptyState.title")}</p>
        <p className="text-sm text-center text-muted-foreground">{t("emptyState.description")}</p>
        <Button onClick={handleAddModule} className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          {t("buttons.addModule")}
        </Button>

        <CreateModuleModal
          courseId={courseId}
          isOpen={isCreateModuleModalOpen}
          onClose={() => setIsCreateModuleModalOpen(false)}
          onModuleCreated={fetchModules} // Refresh list after creation
        />
      </div>
    );
  }

  // --- 6. Render List ---
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddModule}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {t("buttons.addModule")}
        </Button>
      </div>

      {modules.map((module) => (
        <Card key={module.id} className={`border-l-4 ${module.isPublished ? 'border-sky-500' : 'border-slate-300'}`}>
          {/* Module Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/50">
            <div className="flex items-center space-x-3">
              <GripVertical className="w-5 h-5 cursor-grab text-muted-foreground" /> {/* Drag handle hint */}
              <button
                onClick={() => toggleModuleExpansion(module.id)}
                className="flex items-center font-semibold hover:text-primary transition-colors"
              >
                {expandedModules[module.id] ? (
                  <ChevronDown className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                {t("labels.module")} {module.order}: {module.title}
              </button>
              <span className={`text-xs px-2 py-0.5 rounded-full ${module.isPublished ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-700'}`}>
                {module.isPublished ? t("labels.published") : t("labels.draft")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditModule(module.id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)} className="hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => handleAddLesson(module.id)}>
                <PlusCircle className="w-4 h-4 mr-1" />
                {t("buttons.addLesson")}
              </Button>
            </div>
          </CardHeader>

          {/* Lessons List (Expanded Content) */}
          {expandedModules[module.id] && (
            <CardContent className="p-0">
              <Separator />
              {module.lessons.length > 0 ? (
                <ul className="divide-y">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between p-3 pl-10 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground" />
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          {lesson.order}. {lesson.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${lesson.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {lesson.isPublished ? t("labels.live") : t("labels.pending")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditLesson(lesson.id)} title={t("buttons.editLessonTitle")}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson.id)} className="hover:text-red-600" title={t("buttons.deleteLessonTitle")}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t("emptyState.noLessons")}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};