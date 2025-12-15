import { getStudentEnrolledCourses, getEmptyEnrolledCourses, CourseProgress } from "@/lib/data";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { CourseCard } from "@/components/ui/course-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ListFilter, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";


export default async function MyCoursesPage() {
  const t = await getTranslations("dashboardMyCourses");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  let courses: CourseProgress[] = [];
  let hasError = false;

  try {
    // Fetch real data. Use a placeholder to simulate some data if fetching fails.
    courses = await getStudentEnrolledCourses();
    if (courses.length === 0) {
       // Optional: Load mock data if no enrollments are found for a better visual
       // courses = getEmptyEnrolledCourses();
    }
  } catch (e) {
    console.error("Course data fetch failed:", e);
    courses = getEmptyEnrolledCourses();
    hasError = true;
  }

  return (
    <div className="flex flex-col min-h-screen bg-natural-50 dark:bg-navy-900 transition-colors" dir={direction}>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-navy-800 dark:text-natural-100">
            {t("title")}
          </h1>
          {/* Placeholder for filtering/sorting component */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 md:mt-0">
            <ListFilter className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("sortBy")}
            </span>
          </div>
        </div>

        <Separator className="mb-8 bg-orange-200 dark:bg-navy-700" />

        {/* --- Error Alert --- */}
        {hasError && (
          <Alert variant="destructive" className="mb-6 border-orange-500 text-orange-800 dark:border-orange-400 dark:text-orange-300">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t("dataFetchErrorTitle")}</AlertTitle>
            <AlertDescription>
              {t("dataFetchErrorMessage")}
            </AlertDescription>
          </Alert>
        )}

        {/* --- Course Grid (Responsive) --- */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} isRTL={isRTL} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg shadow-sm">
            <BookOpen className="w-16 h-16 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold text-navy-700 dark:text-natural-100">
              {t("noCoursesTitle")}
            </h2>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              {t("noCoursesMessage")}
            </p>
            {/* Optional: Add a button to browse the course catalog */}
          </div>
        )}
      </main>
    </div>
  );
}
