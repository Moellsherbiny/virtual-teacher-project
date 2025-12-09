"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, FileText, Edit, Trash2 } from "lucide-react";
import type { Lesson } from "@/types/course";

interface LessonItemProps {
  lesson: Lesson;
  onEdit: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
  t: any;
}

export const LessonItem: FC<LessonItemProps> = ({ lesson, onEdit, onDelete, t }) => (
  <li className="flex items-center justify-between p-3 pl-10 hover:bg-muted/50 transition-colors">
    <div className="flex items-center space-x-3">
      <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground" />
      <FileText className="w-4 h-4 text-primary" />
      <span className="text-sm">{lesson.order}. {lesson.title}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${lesson.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {lesson.isPublished ? t("labels.live") : t("labels.pending")}
      </span>
    </div>
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="sm" onClick={() => onEdit(lesson.id)} title={t("buttons.editLessonTitle")}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(lesson.id)} className="hover:text-red-600" title={t("buttons.deleteLessonTitle")}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </li>
);
