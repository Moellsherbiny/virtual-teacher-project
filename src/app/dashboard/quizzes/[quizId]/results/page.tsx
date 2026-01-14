import { getQuizAttempts } from "@/actions/admin-quiz-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Calendar, User, Mail, Star, ChevronLeft } from "lucide-react";

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const res = await getQuizAttempts(quizId);

  if (res?.error) return <div className="p-6 text-destructive">{res.error}</div>;

  const totalPossible = res.totalPossibleScore || 100;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">نتائج الاختبار</h1>
          <p className="text-muted-foreground mt-2">تحليل أداء الطلاب وتفاصيل المحاولات</p>
        </div>
        
        <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-2xl border border-border">
          <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
             <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">إجمالي المشاركين</p>
            <p className="text-2xl font-bold text-foreground leading-none">{res.attempts?.length}</p>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="grid gap-5">
        {res.attempts?.map((attempt) => {
          const score = attempt.score || 0;
          const percentage = Math.round((score / totalPossible) * 100);
          
          // دالة الألوان الديناميكية للـ Dark/Light
          const getStatusConfig = (pct: number) => {
            if (pct >= 85) return { 
              label: "ممتاز", 
              colorClass: "text-emerald-600 dark:text-emerald-400",
              bgClass: "bg-emerald-500",
              lightBg: "bg-emerald-50/50 dark:bg-emerald-500/10" 
            };
            if (pct >= 65) return { 
              label: "جيد جداً", 
              colorClass: "text-blue-600 dark:text-blue-400",
              bgClass: "bg-blue-500",
              lightBg: "bg-blue-50/50 dark:bg-blue-500/10" 
            };
            if (pct >= 50) return { 
              label: "ناجح", 
              colorClass: "text-amber-600 dark:text-amber-400",
              bgClass: "bg-amber-500", 
              lightBg: "bg-amber-50/50 dark:bg-amber-500/10" 
            };
            return { 
              label: "راسب", 
              colorClass: "text-red-600 dark:text-red-400",
              bgClass: "bg-red-500",
              lightBg: "bg-red-50/50 dark:bg-red-500/10" 
            };
          };

          const status = getStatusConfig(percentage);

          return (
            <Card key={attempt.id} className="group overflow-hidden border border-border bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  
                  {/* قسم الدرجة الدائري */}
                  <div className={`w-full md:w-44 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-l border-border ${status.lightBg}`}>
                    <div className="relative flex items-center justify-center w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/20" />
                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" 
                          strokeDasharray={213}
                          strokeDashoffset={213 - (213 * percentage) / 100}
                          className={`${status.colorClass.replace('text-', 'stroke-')} transition-all duration-1000 ease-out`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-xl font-black ${status.colorClass}`}>{percentage}%</span>
                    </div>
                    <span className={`mt-3 px-4 py-0.5 rounded-full text-[11px] font-bold text-white ${status.bgClass}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* بيانات الطالب */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {attempt.user.name || "طالب مجهول"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {attempt.user.email}
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 px-3 py-1.5 rounded-lg text-left self-start sm:self-center">
                         <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-bold">تاريخ الإرسال</span>
                         <span className="text-sm font-semibold text-foreground">
                           {new Date(attempt.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 items-center border-t border-border pt-5">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-amber-500/10 p-1.5 rounded-md text-amber-500">
                          <Star className="w-4 h-4 fill-amber-500" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">الدرجة الكلية: {score} / {totalPossible}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(attempt.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* زر الإجراء */}
                  <div className="hidden md:flex items-center justify-center px-4 hover:bg-secondary/50 transition-colors cursor-pointer border-r border-border">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-[-3px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {res.attempts?.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-border rounded-[2rem] bg-card/50">
          <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
             <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">لا توجد محاولات</h3>
          <p className="text-muted-foreground mt-1 text-sm">لم يقم أي طالب بإجراء هذا الاختبار بعد.</p>
        </div>
      )}
    </div>
  );
}