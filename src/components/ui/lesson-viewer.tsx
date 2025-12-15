'use client';

import { LessonContent } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface LessonViewerProps {
  lesson: LessonContent | null;
}

function toYouTubeEmbed(url: string) {
  const id = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${id}`;
}


export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson }) => {
  const t = useTranslations("courseStudy");
  
  if (!lesson) {
    return (
      <Alert className="bg-navy-50 dark:bg-navy-950 border-orange-500">
        <Video className="h-4 w-4 text-orange-500" />
        <AlertTitle>{t("selectLesson")}</AlertTitle>
        <AlertDescription>{t("selectLessonDescription")}</AlertDescription>
      </Alert>
    );
  }

  console.log(lesson.videoUrl)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-navy-800 dark:text-natural-100">{lesson.title}</CardTitle>
          <CardDescription className="flex items-center space-x-2 rtl:space-x-reverse">
            {lesson.type === 'VIDEO' && <Video className="h-4 w-4 text-orange-500" />}
            {lesson.type === 'TEXT' && <FileText className="h-4 w-4 text-orange-500" />}
            {lesson.type === 'MATERILAS' && <File className="h-4 w-4 text-orange-500" />}
            <span>{t(lesson.type.toLowerCase())}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* --- Content Display based on Type --- */}
          {lesson.type === 'VIDEO' && lesson.videoUrl ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={toYouTubeEmbed(lesson.videoUrl)}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                
              ></iframe>
            </div>
          ) : lesson.type === 'TEXT' && lesson.content ? (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : lesson.type === 'MATERILAS' && lesson.fileUrl ? (
            <Alert className="bg-orange-50 dark:bg-orange-950 border-orange-500">
              <File className="h-4 w-4 text-orange-500" />
              <AlertTitle>{t("downloadMaterials")}</AlertTitle>
              <AlertDescription>
                <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline">
                  {t("clickToDownload")}
                </a>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>{t("contentUnavailable")}</AlertTitle>
              <AlertDescription>{t("contentUnavailableMessage")}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* --- Quiz Action --- */}
      {lesson.quizzes.length > 0 && (
        <div className="flex justify-end">
          <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-400 dark:hover:bg-orange-500">
            {t("takeQuiz")}
          </Button>
        </div>
      )}
    </div>
  );
};