import { getAvailableQuizzes } from "@/actions/stud-quiz-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, Clock, Award } from "lucide-react";

export default async function QuizzesPage() {
  const quizzes = await getAvailableQuizzes();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Quizzes</h1>
        <p className="text-muted-foreground">
          Take quizzes to test your knowledge and track your progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const questionCount = quiz.questions.length;
          const attemptCount = quiz.attempts.length;
          const bestScore = quiz.attempts.length > 0
            ? Math.max(...quiz.attempts.map((a) => a.score || 0))
            : null;
          const maxScore = quiz.questions.reduce((sum, q) => sum + q.maxScore, 0);

          return (
            <Card key={quiz.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                    {quiz.description && (
                      <CardDescription>{quiz.description}</CardDescription>
                    )}
                  </div>
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3">
                  {quiz.course && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Course: {quiz.course.title}
                      </Badge>
                    </div>
                  )}
                  {quiz.lesson && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Lesson: {quiz.lesson.title}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="h-4 w-4" />
                      <span>{questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{attemptCount} attempts</span>
                    </div>
                  </div>

                  {bestScore !== null && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="text-sm font-medium">Best Score</div>
                        <div className="text-lg font-bold">
                          {bestScore.toFixed(1)}/{maxScore.toFixed(1)}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({((bestScore / maxScore) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/quizzes/${quiz.id}/take`}>
                    {attemptCount > 0 ? "Retake Quiz" : "Start Quiz"}
                  </Link>
                </Button>
                {attemptCount > 0 && (
                  <Button asChild variant="outline">
                    <Link href={`/quizzes/${quiz.id}/attempts`}>
                      View Attempts
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <Card className="p-12 text-center">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground">
            There are no quizzes available at the moment. Check back later!
          </p>
        </Card>
      )}
    </div>
  );
}