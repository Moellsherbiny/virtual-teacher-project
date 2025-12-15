'use client'

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertQuiz, deleteQuestion } from "@/actions/admin-quiz-actions"; 
import { quizFormSchema } from "@/lib/schemas";
import { QuestionType } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { QuestionDialog } from "./question-dialog"; 

interface QuizBuilderProps {
  initialData?: any; 
}

export default function QuizBuilder({ initialData }: QuizBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [quizId, setQuizId] = useState<string | undefined>(initialData?.id);
  
 
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  
  async function onSubmit(values: z.infer<typeof quizFormSchema>) {
    startTransition(async () => {
      const result = await upsertQuiz(values, quizId);
      if (result.error) {
        toast.error("خطأ", {  description: result.error });
      } else {
        setQuizId(result.quiz?.id);
        toast.success("تم الحفظ بنجاح",{  description: "تم تحديث بيانات الاختبار" });
      }
    });
  }

  // حذف سؤال
  const handleDeleteQuestion = async (qId: string) => {
    if (!quizId) return;
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      const res = await deleteQuestion(qId, quizId);
      if (res.success) {
        toast.success( "تم الحذف",{  description: "تم حذف السؤال بنجاح" });
      } else {
        toast.error("خطأ",{ description: res.error });
      }
    }
  };

  return (
    <div className="space-y-8 p-6 direction-rtl" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة الاختبار</h1>
        {quizId && (
          <Button variant="outline" onClick={() => window.location.href = `/dashboard/quizzes/${quizId}/results`}>
            عرض النتائج
          </Button>
        )}
      </div>

      {/* 1. نموذج بيانات الاختبار */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الاختبار الأساسية</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الاختبار</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: اختبار منتصف الفصل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea placeholder="وصف قصير للاختبار..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ البيانات
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 2. قسم الأسئلة (يظهر فقط بعد حفظ الاختبار) */}
      {quizId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>الأسئلة</CardTitle>
            <Button onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true); }}>
              <Plus className="ml-2 h-4 w-4" /> إضافة سؤال
            </Button>
          </CardHeader>
          <CardContent>
            {!initialData?.questions || initialData.questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">لا يوجد أسئلة مضافة بعد.</p>
            ) : (
              <div className="space-y-4">
                {initialData.questions.map((q: any, index: number) => (
                  <div key={q.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-lg">
                        {index + 1}. {q.text}
                      </span>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded w-fit">
                        {q.type} - {q.points} نقاط
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingQuestion(q); setQuestionModalOpen(true); }}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* مودال إضافة/تعديل السؤال */}
      {quizId && (
        <QuestionDialog
          open={isQuestionModalOpen}
          onOpenChange={setQuestionModalOpen}
          quizId={quizId}
          questionToEdit={editingQuestion}
        />
      )}
    </div>
  );
}