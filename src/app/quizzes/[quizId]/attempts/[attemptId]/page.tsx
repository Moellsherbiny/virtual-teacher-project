import { getAttemptDetails } from "@/actions/stud-quiz-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

interface AttemptDetailsPageProps {
  params: Promise<{ quizId: string; attemptId: string }>;
}

export default async function AttemptDetailsPage({
  params,
}: AttemptDetailsPageProps) {
  const { quizId, attemptId } = await params;

  try {
    const attempt = await getAttemptDetails(attemptId);

    const maxScore = attempt.quiz.questions.reduce(
      (sum, q) => sum + q.maxScore,
      0
    );
    const percentage = ((attempt.score || 0) / maxScore) * 100;

    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/quizzes/${quizId}/attempts`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Attempts
          </Link>
        </Button>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{attempt.quiz.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submitted on {format(new Date(attempt.createdAt), "PPpp")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Your Score
                </div>
                <div className="text-3xl font-bold">
                  {(attempt.score || 0).toFixed(1)}
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Max Score
                </div>
                <div className="text-3xl font-bold">{maxScore.toFixed(1)}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Percentage
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Answers */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Review</h2>
          {attempt.quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers.find(
              (a) => a.questionId === question.id
            );
            const correctAnswers = question.answers.filter((a) => a.isCorrect);

            let isCorrect = false;
            if (userAnswer) {
              if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
                isCorrect = userAnswer.answer?.isCorrect || false;
              } else if (question.type === "MULTI_SELECT") {
                const userAnswerIds = attempt.answers
                  .filter((a) => a.questionId === question.id)
                  .map((a) => a.answerId)
                  .filter(Boolean)
                  .sort();
                const correctIds = correctAnswers
                  .map((a) => a.id)
                  .sort();
                isCorrect =
                  userAnswerIds.length === correctIds.length &&
                  userAnswerIds.every((id, idx) => id === correctIds[idx]);
              } else {
                isCorrect =
                  userAnswer.writtenAnswer?.trim().toLowerCase() ===
                  question.correctText?.trim().toLowerCase();
              }
            }

            return (
              <Card
                key={question.id}
                className={
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium">
                      Question {index + 1}
                      <Badge className="ml-2" variant="outline">
                        {question.maxScore} point
                        {question.maxScore !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                    {isCorrect ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">Incorrect</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base font-medium">{question.question}</p>

                  {/* User's Answer */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Your Answer:
                    </div>
                    {(question.type === "MULTIPLE_CHOICE" ||
                      question.type === "TRUE_FALSE") && (
                      <div
                        className={`p-3 rounded-lg ${
                          isCorrect
                            ? "bg-green-100 border border-green-300"
                            : "bg-red-100 border border-red-300"
                        }`}
                      >
                        {userAnswer?.answer?.text || "Not answered"}
                      </div>
                    )}

                    {question.type === "MULTI_SELECT" && (
                      <div className="space-y-2">
                        {question.answers.map((answer) => {
                          const wasSelected = attempt.answers.some(
                            (a) =>
                              a.questionId === question.id &&
                              a.answerId === answer.id
                          );
                          return (
                            <div
                              key={answer.id}
                              className={`p-2 rounded ${
                                wasSelected
                                  ? answer.isCorrect
                                    ? "bg-green-100"
                                    : "bg-red-100"
                                  : ""
                              }`}
                            >
                              <span className="mr-2">
                                {wasSelected ? "✓" : "○"}
                              </span>
                              {answer.text}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(question.type === "COMPLETE" ||
                      question.type === "WRITTEN") && (
                      <div
                        className={`p-3 rounded-lg ${
                          isCorrect
                            ? "bg-green-100 border border-green-300"
                            : "bg-red-100 border border-red-300"
                        }`}
                      >
                        {userAnswer?.writtenAnswer || "Not answered"}
                      </div>
                    )}
                  </div>

                  {/* Correct Answer (if wrong) */}
                  {!isCorrect && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                        <AlertCircle className="h-4 w-4" />
                        Correct Answer:
                      </div>
                      {(question.type === "MULTIPLE_CHOICE" ||
                        question.type === "TRUE_FALSE") && (
                        <div className="p-3 rounded-lg bg-green-100 border border-green-300">
                          {correctAnswers[0]?.text}
                        </div>
                      )}

                      {question.type === "MULTI_SELECT" && (
                        <div className="space-y-2">
                          {question.answers
                            .filter((a) => a.isCorrect)
                            .map((answer) => (
                              <div
                                key={answer.id}
                                className="p-2 rounded bg-green-100"
                              >
                                ✓ {answer.text}
                              </div>
                            ))}
                        </div>
                      )}

                      {(question.type === "COMPLETE" ||
                        question.type === "WRITTEN") && (
                        <div className="p-3 rounded-lg bg-green-100 border border-green-300">
                          {question.correctText}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href={`/quizzes/${quizId}/take`}>Retake Quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/quizzes">Back to Quizzes</Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}