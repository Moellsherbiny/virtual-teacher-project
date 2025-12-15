import db from "@/lib/database/prisma";
import QuizBuilder from "@/components/dashboard/quiz/quiz-builder"; 

export default async function QuizEditPage(
  { params }: { params: Promise<{ quizId: string }> }) {
  // إذا كان ID "new" لن نجلب بيانات
  let quiz = null;
  
  const { quizId } = await params;
  
  if (quizId !== "new") {
    quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { answers: true },
          
        }
      }
    });
  }

  return (
    <div className="container mx-auto py-10">
      <QuizBuilder initialData={quiz} />
    </div>
  );
}