import Link from "next/link";
import db from "@/lib/database/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { QuizActions } from "@/components/dashboard/quiz/quiz-actions"; // المكون الذي أنشأناه بالأعلى

export default async function QuizzesPage() {
  // جلب الاختبارات مع عدد الأسئلة المرتبطة بها
  const quizzes = await db.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true, attempts: true }
      }
    }
  });

  return (
    <div className="container mx-auto py-10 space-y-8" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الاختبارات</h1>
          <p className="text-muted-foreground mt-2">إدارة الاختبارات والأسئلة والنتائج.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/quizzes/new">
            <Plus className="ml-2 h-4 w-4" /> إنشاء اختبار جديد
          </Link>
        </Button>
      </div>

      {/* جدول البيانات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الاختبارات</CardTitle>
          <CardDescription>
            لديك حالياً {quizzes.length} اختبار مسجل في النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[300px]">العنوان</TableHead>
                <TableHead className="text-right">عدد الأسئلة</TableHead>
                <TableHead className="text-right">عدد المحاولات</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    لا يوجد اختبارات. ابدأ بإنشاء واحد جديد.
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{quiz.title}</span>
                        {quiz.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {quiz.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {quiz._count.questions} أسئلة
                      </Badge>
                    </TableCell>
                    <TableCell>
                        {quiz._count.attempts > 0 ? (
                             <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {quiz._count.attempts} طالب
                             </Badge>
                        ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                        )}
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat('ar-EG', {
                        dateStyle: 'medium',
                      }).format(quiz.createdAt)}
                    </TableCell>
                    <TableCell>
                      <QuizActions quizId={quiz.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}