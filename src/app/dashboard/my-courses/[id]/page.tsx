import { getStudentCourseDetails, getStudentId, CourseDetails } from "@/lib/data";
import { getTranslations, getLocale } from "next-intl/server";
import { CourseStudyLayout } from "@/components/dashboard/course/course-study-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { auth } from "@/lib/auth";


export default async function CourseStudyServerPage({ 
  params,
}: { 
  params: Promise<{id:string}>
}) {
  const { id  } = await params;
  const t = await getTranslations("courseStudy");
  const locale = await getLocale();
  const session = await auth();
  const studentId = session?.user.id! ; 
  let courseDetails: CourseDetails | null = null;
  let hasError = false;

  try {
    courseDetails = await getStudentCourseDetails(id, studentId);
  } catch (e) {
    console.error(`[SC] Failed to fetch course ${id}:`, e);
    hasError = true;
  }

  if (!courseDetails) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('courseNotFound')}</AlertTitle>
          <AlertDescription>{t('courseNotFoundMessage')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CourseStudyLayout 
      courseDetails={courseDetails}
      locale={locale}
      error={hasError ? t('dataFetchErrorMessage') : null}
    />
  );
}