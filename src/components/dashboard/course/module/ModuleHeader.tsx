"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2, PlusCircle, ChevronDown, ChevronRight } from "lucide-react";
import type { Module } from "@/types/course";

interface ModuleHeaderProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (moduleId: string) => void;
  onDelete: (moduleId: string) => void;
  onAddLesson: (moduleId: string) => void;
  t: any;
}

export const ModuleHeader: FC<ModuleHeaderProps> = ({
  module,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddLesson,
  t,
}) => (
  <div className="flex flex-row items-center justify-between p-4 bg-muted/50">
    <div className="flex items-center space-x-3">
      <GripVertical className="w-5 h-5 cursor-grab text-muted-foreground" />
      <button
        onClick={onToggleExpand}
        className="flex items-center font-semibold hover:text-primary transition-colors"
      >
        {isExpanded ? (
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
      <Button variant="ghost" size="sm" onClick={() => onEdit(module.id)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(module.id)} className="hover:text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button size="sm" onClick={() => onAddLesson(module.id)}>
        <PlusCircle className="w-4 h-4 mr-1" />
        {t("buttons.addLesson")}
      </Button>
    </div>
  </div>
);
