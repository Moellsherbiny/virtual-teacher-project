'use client';

import { useMemo, useState } from 'react';
import { CourseDetails, LessonContent } from "@/lib/data";
import { useTranslations } from "next-intl";
import { CourseOutline } from './course-outline';
import { LessonViewer } from '@/components/ui/lesson-viewer';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface CourseStudyLayoutProps {
  courseDetails: CourseDetails;
  locale: string;
  error: string | null;
}

export const CourseStudyLayout: React.FC<CourseStudyLayoutProps> = ({ 
  courseDetails, 
  locale,
  error,
}) => {
  const t = useTranslations("courseStudy");
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const initialLessonId = useMemo(() => courseDetails.modules[0]?.lessons[0]?.id || '', [courseDetails]);
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLessonId);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const allLessons: LessonContent[] = useMemo(() => 
    courseDetails.modules.flatMap(m => m.lessons), 
    [courseDetails]
  );
  
  const activeLesson: LessonContent | null = useMemo(() => 
    allLessons.find(l => l.id === activeLessonId) || null, 
    [allLessons, activeLessonId]
  );

  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
    // Close the sheet on mobile after selection
    setIsSheetOpen(false);
  };

  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;


  return (
    <div className="min-h-screen flex bg-natural-50 dark:bg-navy-900" dir={direction}>
      
      {/* --- Desktop Sidebar (Course Outline) --- */}
      <aside className="hidden lg:block w-80 shrink-0 border-r bg-card dark:border-navy-700 p-4 sticky top-0 h-screen">
        <CourseOutline 
          courseDetails={courseDetails} 
          activeLessonId={activeLessonId} 
          onLessonClick={handleLessonClick} 
          isRTL={isRTL}
        />
      </aside>

      {/* --- Main Content Area (Lesson Viewer) --- */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* --- Header (Mobile Toggle & Progress) --- */}
        <header className="flex justify-between items-center lg:hidden mb-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 bg-orange-500 hover:bg-orange-600 dark:bg-navy-700 dark:hover:bg-navy-600 text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side={isRTL ? "right" : "left"} 
              className="w-80 sm:w-96 p-4 pt-10 overflow-y-auto bg-card dark:bg-navy-900"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-navy-800 dark:text-natural-100">
                  {t('courseOutline')}
                </SheetTitle>
              </SheetHeader>
              {/* Pass the Outline component to the Sheet */}
              <CourseOutline 
                courseDetails={courseDetails} 
                activeLessonId={activeLessonId} 
                onLessonClick={handleLessonClick} 
                isRTL={isRTL}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-navy-800 dark:text-natural-100 flex-1 text-center truncate mx-4">
            {courseDetails.title}
          </h1>
        </header>
        
        {/* --- Desktop Course Title and Progress --- */}
        <div className="hidden lg:block mb-6">
          <h1 className="text-4xl font-extrabold text-navy-800 dark:text-natural-100 mb-2">
            {courseDetails.title}
          </h1>
          <p className="text-lg text-muted-foreground">{courseDetails.description}</p>
        </div>

        {/* --- Error Alert from Server Fetch --- */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-orange-500 text-orange-800 dark:border-orange-400 dark:text-orange-300">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t('dataFetchErrorTitle')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* --- Progress Bar --- */}
        <div className="mb-8 p-4 rounded-lg bg-card shadow-sm dark:bg-navy-800">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-navy-700 dark:text-natural-100">
              {t('yourProgress')}
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              {courseDetails.completedLessons} / {courseDetails.totalLessons} {t('lessonsCompleted')} ({courseDetails.overallProgress}%)
            </span>
          </div>
          <Progress value={courseDetails.overallProgress} className="h-3 [&>div]:bg-orange-500 dark:[&>div]:bg-orange-400" />
        </div>

        {/* --- Lesson Content Viewer --- */}
        <LessonViewer 
          lesson={activeLesson} 
        />

        {/* --- Navigation Buttons --- */}
        <div className={`flex mt-8 gap-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button 
            variant="outline" 
            onClick={() => prevLesson && handleLessonClick(prevLesson.id)}
            disabled={!prevLesson} 
            className="text-muted-foreground border-navy-300 dark:border-navy-600"
          >
            {isRTL ? 'الدرس السابق' : 'Previous Lesson'}
          </Button>
          <Button 
            onClick={() => nextLesson && handleLessonClick(nextLesson.id)}
            disabled={!nextLesson} 
            className="bg-navy-600 hover:bg-navy-700 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            {isRTL ? 'الدرس التالي' : 'Next Lesson'}
          </Button>
        </div>
      </main>
    </div>
  );
};