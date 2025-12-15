'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Loader2,
  Terminal,
  Menu,
  GraduationCap,
} from 'lucide-react';

import { CourseOutlineItem } from '@/components/ui/course-outline-item';
import { LessonViewer } from '@/components/ui/lesson-viewer';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

/* =======================
   ✅ TYPES (Client-safe)
======================= */

export interface LessonContent {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'MATERILAS';
  content: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  order: number;
  quizzes: { id: string; title: string }[];
  isCompleted: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: LessonContent[];
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string | null;
  instructorName: string;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  modules: CourseModule[];
}

/* =======================
   ✅ COMPONENT
======================= */

interface Props {
  courseDetails: CourseDetails | null;
}

export default function CourseStudyClient({ courseDetails }: Props) {
  const t = useTranslations('courseStudy');
  const locale = useLocale();

  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  const [activeLessonId, setActiveLessonId] = useState(
    courseDetails?.modules[0]?.lessons[0]?.id ?? ''
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /* =======================
     ✅ DERIVED DATA
  ======================= */

  const allLessons = useMemo(
    () => courseDetails?.modules.flatMap(m => m.lessons) ?? [],
    [courseDetails]
  );

  const activeLesson = useMemo(
    () => allLessons.find(l => l.id === activeLessonId) ?? null,
    [allLessons, activeLessonId]
  );

  /* =======================
     ✅ HANDLERS
  ======================= */

  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setIsSheetOpen(false);
  };

  /* =======================
     ✅ STATES
  ======================= */

  if (!courseDetails) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('courseNotFound')}</AlertTitle>
          <AlertDescription>
            {t('courseNotFoundMessage')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /* =======================
     ✅ COURSE OUTLINE
  ======================= */

  const CourseOutline = (
    <nav className="h-full overflow-y-auto pr-2 rtl:pl-2 pb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          {t('courseOutline')}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-orange-500" />
          <span>{courseDetails.instructorName}</span>
        </div>
      </div>

      {courseDetails.modules.map(module => (
        <div key={module.id} className="mb-6">
          <h3 className="font-bold mb-2 p-3 rounded bg-muted">
            {t('module')} {module.order}: {module.title}
          </h3>

          <div className="space-y-1">
            {module.lessons.map(lesson => (
              <CourseOutlineItem
                key={lesson.id}
                lesson={lesson}
                isActive={lesson.id === activeLessonId}
                onLessonClick={handleLessonClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  /* =======================
     ✅ RENDER
  ======================= */

  return (
    <div
      className="min-h-screen flex bg-background"
      dir={direction}
    >
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:block w-80 border-r p-4 sticky top-0 h-screen">
        {CourseOutline}
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* ===== Mobile Header ===== */}
        <header className="flex items-center justify-between lg:hidden mb-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side={isRTL ? 'right' : 'left'}
              className="w-80 sm:w-96"
            >
              <SheetHeader>
                <SheetTitle>
                  {t('courseOutline')}
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              {CourseOutline}
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-bold truncate mx-4">
            {courseDetails.title}
          </h1>
        </header>

        {/* ===== Course Info ===== */}
        <div className="hidden lg:block mb-6">
          <h1 className="text-4xl font-extrabold mb-2">
            {courseDetails.title}
          </h1>
          {courseDetails.description && (
            <p className="text-muted-foreground">
              {courseDetails.description}
            </p>
          )}
        </div>

        {/* ===== Progress ===== */}
        <div className="mb-8 p-4 rounded bg-card shadow-sm">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>{t('yourProgress')}</span>
            <span className="text-orange-600 font-semibold">
              {courseDetails.completedLessons} /{' '}
              {courseDetails.totalLessons}{' '}
              {t('lessonsCompleted')} (
              {courseDetails.overallProgress}%)
            </span>
          </div>
          <Progress value={courseDetails.overallProgress} />
        </div>

        {/* ===== Lesson Viewer ===== */}
        {activeLesson && (
          <LessonViewer
            lesson={activeLesson}
          />
        )}

        {/* ===== Navigation ===== */}
        <div
          className={`flex mt-8 gap-4 ${
            isRTL ? 'justify-start' : 'justify-end'
          }`}
        >
          <Button variant="outline" disabled>
            {isRTL ? 'الدرس السابق' : 'Previous Lesson'}
          </Button>
          <Button>
            {isRTL ? 'الدرس التالي' : 'Next Lesson'}
          </Button>
        </div>
      </main>
    </div>
  );
}
