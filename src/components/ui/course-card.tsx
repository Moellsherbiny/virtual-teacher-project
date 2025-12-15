import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseProgress } from "@/lib/data";
import { useTranslations } from "next-intl";

interface CourseCardProps {
  course: CourseProgress;
  isRTL: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isRTL }) => {
  const t = useTranslations("dashboardMyCourses");
  const { title, description, imageUrl, instructorName, progressPercentage } = course;

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-40 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-navy-400 dark:text-navy-600" />
          </div>
        )}
      </div>

      <CardHeader className="p-4 flex-1">
        <CardTitle className="text-xl font-semibold text-navy-800 dark:text-natural-100 line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {description || t("noDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mb-3">
          <User className="w-4 h-4 text-orange-500" />
          <span>{instructorName}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-navy-700 dark:text-natural-100">
              {t("progress")}
            </span>
            <span className="text-orange-600 dark:text-orange-400">
              {progressPercentage}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 [&>div]:bg-orange-500 dark:[&>div]:bg-orange-400" />
        </div>
        
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-orange-500 dark:hover:bg-orange-600"
          asChild
        >
          <Link href={`/dashboard/my-courses/${course.id}`}>
          {t("continueLearning")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};