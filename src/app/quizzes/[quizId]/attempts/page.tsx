import { getQuizAttempts } from "@/actions/stud-quiz-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { notFound } from "next/navigation";

interface QuizAttemptsPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizAttemptsPage({ params }: QuizAttemptsPageProps) {
  const { quizId } = await params;

  try {
    const attempts = await getQuizAttempts(quizId);

    if (attempts.length === 0) {
      return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/quizzes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Link>
          </Button>

          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Attempts Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't taken this quiz yet. Start now to see your results here!
            </p>
            <Button asChild>
              <Link href={`/quizzes/${quizId}/take`}>Take Quiz</Link>
            </Button>
          </Card>
        </div>
      );
    }

    const maxScore = attempts[0].quiz.title
      ? attempts[0].answers.reduce(
          (sum, a) => sum + (a.question.maxScore || 0),
          0
        ) / attempts[0].answers.length * attempts[0].answers.length
      : 0;

    const scores = attempts.map((a) => a.score || 0);
    const bestScore = Math.max(...scores);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const latestScore = scores[0];
    const previousScore = scores[1];

    let trend: "up" | "down" | "same" | null = null;
    if (scores.length > 1) {
      if (latestScore > previousScore) trend = "up";
      else if (latestScore < previousScore) trend = "down";
      else trend = "same";
    }

    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/quizzes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{attempts[0].quiz.title}</h1>
          <p className="text-muted-foreground">
            View all your attempts and track your progress
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attempts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Best Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <div className="text-2xl font-bold">
                  {((bestScore / maxScore) * 100).toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((averageScore / maxScore) * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Latest Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {trend === "up" && (
                  <>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">↑</span>
                  </>
                )}
                {trend === "down" && (
                  <>
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">↓</span>
                  </>
                )}
                {trend === "same" && (
                  <>
                    <Minus className="h-5 w-5 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-600">−</span>
                  </>
                )}
                {trend === null && (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attempts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Attempts</h2>
          {attempts.map((attempt, index) => {
            const percentage = ((attempt.score || 0) / maxScore) * 100;
            const isBest = attempt.score === bestScore;

            return (
              <Card key={attempt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Attempt #{attempts.length - index}
                        {isBest && (
                          <Badge className="ml-2 bg-yellow-500">Best</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(attempt.createdAt), "PPpp")}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {(attempt.score || 0).toFixed(1)}/{maxScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/quizzes/${quizId}/attempts/${attempt.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6">
          <Button asChild>
            <Link href={`/quizzes/${quizId}/take`}>Take Quiz Again</Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}