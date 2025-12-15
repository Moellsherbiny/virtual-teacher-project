import { getQuizById } from "@/actions/stud-quiz-actions";
import { QuizForm } from "@/components/dashboard/quiz/QuizFrorm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface TakeQuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function TakeQuizPage({ params }: TakeQuizPageProps) {
  const { quizId } = await params;
  
  try {
    const quiz = await getQuizById(quizId);

    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-base">
                {quiz.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{quiz.questions.length} questions</span>
              <span>•</span>
              <span>
                Total Points:{" "}
                {quiz.questions.reduce((sum, q) => sum + q.maxScore, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <QuizForm quiz={quiz} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}