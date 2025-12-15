'use client';

import { LessonContent } from "@/lib/data";
import { CheckCircle, PlayCircle, FileText, File, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface CourseOutlineItemProps {
  lesson: LessonContent;
  isActive: boolean;
  onLessonClick: (lessonId: string) => void;
 
}

export const CourseOutlineItem: React.FC<CourseOutlineItemProps> = ({
  lesson,
  isActive,
  onLessonClick,
}) => {
  const t = useTranslations("courseStudy");
  const locale = useLocale()
  const isRTL = locale === "ar";
  const Icon = lesson.type === 'VIDEO' ? PlayCircle : 
               lesson.type === 'TEXT' ? FileText : 
               lesson.type === 'MATERILAS' ? File : 
               HelpCircle;

  const statusColor = lesson.isCompleted 
    ? "text-navy-600 dark:text-navy-200"
    : "text-muted-foreground";

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-auto justify-start p-3 transition-colors text-wrap",
        isRTL && "text-right",
        isActive
          ? "bg-orange-100 dark:bg-navy-800 border-r-4 border-orange-500 dark:border-orange-400"
          : "hover:bg-natural-100 dark:hover:bg-navy-800"
      )}
      onClick={() => onLessonClick(lesson.id)}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`flex items-start w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {lesson.isCompleted ? (
          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-1" />
        ) : (
          <Icon className={cn("h-4 w-4 shrink-0 mt-1", statusColor)} />
        )}
        <div className={cn("flex-1 text-sm font-medium", isRTL ? 'mr-3' : 'ml-3')}>
          {lesson.order}. {lesson.title}
        </div>
      </div>
      {lesson.quizzes.length > 0 && (
        <div className={cn("text-xs text-orange-500", isRTL ? 'mr-auto mt-1' : 'ml-auto mt-1')}>
          {t("quiz")}
        </div>
      )}
    </Button>
  );
};