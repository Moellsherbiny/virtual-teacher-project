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
import { BookOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from '@/lib/apiHandler';

type Lesson = {
  id: string;
  title: string;
  content: string;
  duration: string;
  pdfUrl: string; // رابط ملف PDF لكل درس
};

const dummyLessons: Lesson[] = [
  {
    id: "1",
    title: "مقدمة في البرمجة",
    content: "في هذا الدرس سنتعلم أساسيات البرمجة...",
    duration: "45 دقيقة",
    pdfUrl: "/lessons/lesson1.pdf" // مسار ملف PDF الثابت
  },
  {
    id: "2",
    title: "المتغيرات والثوابت",
    content: "سنتعرف على كيفية استخدام المتغيرات...",
    duration: "30 دقيقة",
    pdfUrl: "/lessons/lesson2.pdf"
  },
  {
    id: "3",
    title: "الدوال والوظائف",
    content: "شرح مفصل عن الدوال في البرمجة...",
    duration: "60 دقيقة",
    pdfUrl: "/lessons/lesson3.pdf"
  }
];

const CourseLessons = ({params} : {params:{lessonId:number} }) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>(dummyLessons[0].pdfUrl);
  const {lessonId} = params;

  const handleLessonExpand = async (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
      return;
    }

    setLoadingStates(prev => ({ ...prev, [lessonId]: true }));
    setExpandedLesson(lessonId);
    
    // تحديث رابط PDF عند فتح الدرس
    const lesson = dummyLessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedPdfUrl(lesson.pdfUrl);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingStates(prev => ({ ...prev, [lessonId]: false }));
  };

  useEffect(()=>{
    const getData = async () =>{
      const {data} = await axiosInstance.get(`lessons/${lessonId}`)
      console.log(data)
    }
    getData()
  },[lessonId])
  return (
    <div dir="rtl"  className="max-w-6xl mx-auto p-4 md:p-6">
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
                  {dummyLessons.map((lesson) => (
                    <AccordionItem
                      dir='rtl'
                      key={lesson.id}
                      value={lesson.id}
                      className=" border rounded-lg p-2 hover:bg-gray-50 transition-colors"
                    >
                      <AccordionTrigger className="flex justify-between items-center p-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{lesson.id}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                            <p className="text-sm text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="p-4">
                        {loadingStates[lesson.id] ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[80%]" />
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed">{lesson.content}</p>
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
              <div className="flex items-center space-x-4 mb-6 rtl:space-x-reverse">
                <FileText className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">محتوى الدرس</h2>
              </div>
              
              <div className="h-[70vh] border rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  src={selectedPdfUrl}
                  className="w-full h-full"
                  title="PDF Viewer"
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