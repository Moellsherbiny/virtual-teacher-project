"use client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from '@/lib/apiHandler';
import { renderMessageContent } from '@/components/ai-message-format/messageFormater';

type Lesson = {
  lesson_id: string;
  course_id: string;
  title: string;
  content: string;
};

const CourseLessons = ({ params }: { params: { id: number } }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ [key: string]: string }>({});
  const [contentLoading, setContentLoading] = useState<{ [key: string]: boolean }>({});
  const [contentError, setContentError] = useState<{ [key: string]: string }>({});

  const pdfUrl = "/book.pdf";
  const { id } = params;

  // جلب محتوى الدرس
  const fetchLessonContent = async (lessonId: string) => {
    try {
      setContentLoading(prev => ({ ...prev, [lessonId]: true }));
      setContentError(prev => ({ ...prev, [lessonId]: '' }));

      const { data } = await axiosInstance.post('/generation/content',
        { lessonId },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      setGeneratedContent(prev => ({ ...prev, [lessonId]: data.message.content }));
      console.log(data.message.content);
    } catch (err) {
      setContentError(prev => ({
        ...prev,
        [lessonId]: 'فشل في تحميل محتوى الدرس. يرجى المحاولة مرة أخرى.'
      }));
    } finally {
      setContentLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const handleLessonExpand = async (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
      return;
    }

    setExpandedLesson(lessonId);

    // جلب المحتوى فقط إذا لم يتم جلبه مسبقاً
    if (!generatedContent[lessonId] && !contentLoading[lessonId]) {
      fetchLessonContent(lessonId);
    }
  };

  // جلب قائمة الدروس
  useEffect(() => {
    const getLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`lessons/${id}`);
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ?
          err.message :
          'حدث خطأ أثناء تحميل الدروس. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    getLessons();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تنبيه</AlertTitle>
          <AlertDescription>لا توجد دروس متاحة في هذا الكورس حالياً.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-4 md:p-6">
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">الدروس</TabsTrigger>
          <TabsTrigger value="pdf">محتوى PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <Card>
            <CardContent className="p-6">
              <div dir='rtl' className="flex items-center space-x-4 mb-6 rtl:space-x-reverse">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">دروس الكورس</h1>
              </div>

              <ScrollArea className="h-[70vh] rounded-md border p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="space-y-4"
                  value={expandedLesson || ""}
                  onValueChange={handleLessonExpand}
                >
                  {lessons.map((lesson, index) => (
                    <AccordionItem
                      dir='rtl'
                      key={lesson.lesson_id}
                      value={lesson.lesson_id}
                      className="border rounded-lg p-2 hover:bg-gray-50 transition-colors"
                    >
                      <AccordionTrigger className="flex justify-between items-center p-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="p-4">
                        {contentLoading[lesson.lesson_id] ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[80%]" />
                          </div>
                        ) : contentError[lesson.lesson_id] ? (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{contentError[lesson.lesson_id]}</AlertDescription>
                          </Alert>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                          
                              {renderMessageContent(generatedContent[lesson.lesson_id] || "")}
                            
                          </div>

                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf">
          <Card>
            <CardContent className="p-6">
              <div dir="rtl" className="flex items-center space-x-4 mb-6 rtl:space-x-reverse">
                <FileText className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">محتوى الكورس</h2>
              </div>

              <div className="h-[70vh] border rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Course Content PDF"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseLessons;