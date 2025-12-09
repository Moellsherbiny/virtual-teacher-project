// src/components/course/module/ModuleCard.tsx
"use client";

import { FC, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Module, Lesson } from "@/types/course"; // Import the defined types
import {
  PlusCircle, Edit, Trash2, ChevronDown, ChevronRight,
  GripVertical, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { ManageModuleDialog } from "./ManageModuleDialog";
import { DeleteModuleDialog } from "./DeleteModuleDialog"; // New Dialog for Module Deletion
import { ManageLessonDialog } from "../lesson/ManageLessonDialog";
import { DeleteLessonDialog } from "../lesson/DeleteLessonDialog";


// --- Component Props Interface ---
interface ModuleCardProps {
  module: Module;
  t: any; // i18n translation function
  // Module Handlers
  onModuleEdit: (module: Module) => void;
  onModuleDelete: (moduleId: string) => void;
  // Lesson Handlers
  onLessonCreate: (moduleId: string) => void;
  onLessonEdit: (lesson: Lesson) => void;
  onLessonDelete: (lesson: Lesson) => void;
}

export const ModuleCard: FC<ModuleCardProps> = ({
  module,
  t,
  onModuleEdit,
  onModuleDelete,
  onLessonCreate,
  onLessonEdit,
  onLessonDelete
}) => {
  // --- Local State for UI ---
  const [expanded, setExpanded] = useState(false);

  // --- Dialog Management State ---
  // Module Dialogs
  const [isModuleEditDialogOpen, setIsModuleEditDialogOpen] = useState(false);
  const [isModuleDeleteDialogOpen, setIsModuleDeleteDialogOpen] = useState(false);

  // Lesson Dialogs
  // NOTE: Lesson dialogs are now controlled by the parent component passing these handlers.
  // However, we keep the lesson deletion dialog state here for confirmation flow.
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  // --- Local Handlers ---
  const toggleExpand = () => setExpanded(prev => !prev);

  // Module Handlers
  const handleEditModule = () => {
    setIsModuleEditDialogOpen(true);
    // Parent component's edit function will be called inside ManageModuleDialog
  };
  const handleDeleteModuleClick = () => {
    setIsModuleDeleteDialogOpen(true);
  };
  const handleModuleDeleteConfirmed = () => {
    onModuleDelete(module.id);
    setIsModuleDeleteDialogOpen(false);
  };

  // Lesson Handlers
  const handleAddLessonClick = () => onLessonCreate(module.id);
  const handleEditLessonClick = (lesson: Lesson) => onLessonEdit(lesson);
  const handleDeleteLessonClick = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteLessonDialogOpen(true);
  };
  const handleLessonDeleteConfirmed = () => {
    if (lessonToDelete) {
      onLessonDelete(lessonToDelete);
      setIsDeleteLessonDialogOpen(false);
      setLessonToDelete(null);
    }
  };

  return (
    <Card
      // Use the primary color for drag/drop indication
      className={`border-l-4 ${module.isPublished ? 'border-sky-500' : 'border-slate-300'}`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/50">
        <div className="flex items-center space-x-3">
          {/* Drag handle for reordering */}
          <GripVertical className="w-5 h-5 cursor-grab text-muted-foreground" />
          {/* Toggle expand/collapse */}
          <button
            onClick={toggleExpand}
            className="flex items-center font-semibold hover:text-primary transition-colors"
          >
            {expanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
            {t("labels.module")} {module.order}: {module.title}
          </button>
          {/* Publish Status */}
          <span className={`text-xs px-2 py-0.5 rounded-full ${module.isPublished ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-700'}`}>
            {module.isPublished ? t("labels.published") : t("labels.draft")}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Module Actions */}
          <Button variant="ghost" size="sm" onClick={handleEditModule} title={t("buttons.editModuleTitle")}><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleDeleteModuleClick} className="hover:text-red-600" title={t("buttons.deleteModuleTitle")}><Trash2 className="w-4 h-4" /></Button>

          {/* Add Lesson Button */}
          <Button size="sm" onClick={handleAddLessonClick}><PlusCircle className="w-4 h-4 mr-1" />{t("buttons.addLesson")}</Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-0">
          <Separator />
          {module.lessons.length > 0 ? (
            <ul className="divide-y">
              {module.lessons
                .sort((a, b) => a.order - b.order) // Ensure lessons are sorted by order
                .map(lesson => (
                  <li key={lesson.id} className="flex items-center justify-between p-3 pl-10 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground" />
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">{lesson.order}. {lesson.title}</span>
                      {/* Lesson Status */}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${lesson.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {lesson.isPublished ? t("labels.live") : t("labels.pending")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* Lesson Actions */}
                      <Button variant="ghost" size="sm" onClick={() => handleEditLessonClick(lesson)} title={t("buttons.editLessonTitle")}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteLessonClick(lesson)} className="hover:text-red-600" title={t("buttons.deleteLessonTitle")}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : <div className="p-4 text-center text-sm text-muted-foreground">{t("emptyState.noLessons")}</div>}
        </CardContent>
      )}

      {/* --- DIALOGS (Managed by ModuleCard) --- */}

      {/* 1. Manage/Edit Module Dialog */}
      <ManageModuleDialog
        isOpen={isModuleEditDialogOpen}
        onClose={() => setIsModuleEditDialogOpen(false)}
        courseId={module.courseId}
        onSubmit={onModuleEdit}
        module={module}
        t={t}
      />

      {/* 2. Delete Module Dialog */}
      <DeleteModuleDialog
        isOpen={isModuleDeleteDialogOpen}
        onClose={() => setIsModuleDeleteDialogOpen(false)}
        onConfirm={handleModuleDeleteConfirmed}
        moduleTitle={module.title}
        t={t}
      />

      {/* 3. Delete Lesson Dialog (Confirm Deletion) */}
      <DeleteLessonDialog
        isOpen={isDeleteLessonDialogOpen}
        lesson={lessonToDelete}
        onClose={() => setIsDeleteLessonDialogOpen(false)}
        onConfirm={handleLessonDeleteConfirmed}
        t={t}
      />
    </Card>
  );
};