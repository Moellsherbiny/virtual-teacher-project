import { getStudentDashboardData, type DashboardSummary } from "@/lib/data";
import { getTranslations  } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { BookOpen, CheckCircle, GraduationCap, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Import a local component for the Theme/Language Switcher (not provided, but essential)
// import { ThemeLanguageSwitcher } from "@/components/layout/theme-language-switcher"; 

// --- Mock Data Function for Fallback/Skeleton ---
const getEmptyDashboardData = (): DashboardSummary => ({
  totalCourses: 0,
  activeCourses: 0,
  completedQuizzes: 0,
  avgQuizScore: 0,
  latestEnrollments: [],
});


export default async function StudentDashboardPage() {
  const t = await getTranslations("studentDashboard")
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  let dashboardData: DashboardSummary;
  let hasError = false;

  try {
    dashboardData = await getStudentDashboardData();
  } catch (e) {
    console.error("Dashboard data fetch failed:", e);
    dashboardData = getEmptyDashboardData();
    hasError = true;
  }

  const {
    totalCourses,
    activeCourses,
    completedQuizzes,
    avgQuizScore,
    latestEnrollments,
  } = dashboardData;

  const dashboardCards = [
    {
      title: t("totalCourses"),
      value: totalCourses,
      icon: BookOpen,
      description: t("totalCoursesDescription"),
    },
    {
      title: t("activeCourses"),
      value: activeCourses,
      icon: GraduationCap,
      description: t("activeCoursesDescription"),
    },
    {
      title: t("completedQuizzes"),
      value: completedQuizzes,
      icon: CheckCircle,
      description: t("completedQuizzesDescription"),
    },
    {
      title: t("averageScore"),
      value: `${avgQuizScore}%`,
      icon: TrendingUp,
      description: t("averageScoreDescription"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-natural-50 dark:bg-navy-900 transition-colors" dir={direction}>
      {/* Header/Navigation Area would typically go here */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-800 dark:text-natural-100 mb-6">
          {t("title")}
        </h1>

        {/* --- Error Display --- */}
        {hasError && (
          <div className="p-4 mb-6 rounded-lg bg-orange-100 border border-orange-400 text-orange-800 dark:bg-orange-950 dark:border-orange-600 dark:text-orange-300">
            {t("dataFetchError")}
          </div>
        )}

        {/* --- 4x Grid Summary Cards (Responsive) --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {dashboardCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>

        {/* --- Main Content: Latest Activity & Course Progress --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Column 1 & 2: Main Content Area (e.g., Progress Chart or Key Tasks) --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-700 dark:text-natural-100">
                  {t("progressOverview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("progressChartPlaceholder")}</p>
                {/*  */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy-700 dark:text-natural-100">
                  {t("upcomingQuizzes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for fetching and displaying upcoming Quizzes */}
                <p className="text-muted-foreground">{t("noUpcomingQuizzes")}</p>
              </CardContent>
            </Card>
          </div>

          {/* --- Column 3: Latest Activity Feed --- */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-navy-700 dark:text-natural-100">
                {t("latestActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {latestEnrollments.length > 0 ? (
                    latestEnrollments.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <div className="flex items-center space-x-4" dir="ltr"> {/* Force LTR for structured elements like names/dates */}
                          <Avatar>
                            <AvatarImage src={`/avatars/${activity.instructorName}.png`} alt={activity.instructorName || "Instructor"} />
                            <AvatarFallback className="bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-100">
                              {activity.instructorName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={direction}>
                            <p className="text-sm font-medium leading-none text-navy-700 dark:text-natural-100">
                              {activity.courseTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("enrolledBy", { instructor: activity.instructorName! })}
                            </p>
                            <p className="text-xs text-orange-500 dark:text-orange-400">
                              {new Date(activity.enrollmentDate).toLocaleDateString(locale, { dateStyle: 'medium' })}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                            {t("new")}
                          </Badge>
                        </div>
                        {index < latestEnrollments.length - 1 && <Separator className="my-2" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-10">
                      {t("noActivity")}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}