'use client';

import { CourseDetails } from "@/lib/data";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { CourseOutlineItem } from '@/components/ui/course-outline-item';

interface CourseOutlineProps {
  courseDetails: CourseDetails;
  activeLessonId: string;
  onLessonClick: (lessonId: string) => void;
  isRTL: boolean;
}

export const CourseOutline: React.FC<CourseOutlineProps> = ({ 
  courseDetails, 
  activeLessonId, 
  onLessonClick, 
  isRTL 
}) => {
  const t = useTranslations("courseStudy");

  return (
    <nav className="h-full overflow-y-auto pr-2 rtl:pl-2 pb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-navy-800 dark:text-natural-100 mb-2">
          {t('courseOutline')}
        </h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-orange-500" />
          <span>{courseDetails.instructorName}</span>
        </div>
      </div>
      
      {courseDetails.modules.map((module) => (
        <div key={module.id} className="mb-6">
          <h3 className="text-base font-bold text-navy-700 dark:text-natural-200 mb-2 p-3 bg-navy-50 dark:bg-navy-700 rounded-md">
            {t('module')} {module.order}: {module.title}
          </h3>
          <div className="space-y-1">
            {module.lessons.map((lesson) => (
              <CourseOutlineItem
                key={lesson.id}
                lesson={lesson}
                isActive={lesson.id === activeLessonId}
                onLessonClick={onLessonClick}
                
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};