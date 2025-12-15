"use client";

import { useState, useTransition } from "react";
import { submitQuizAttempt } from "@/actions/stud-quiz-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface QuizFormProps {
  quiz: {
    id: string;
    title: string;
    questions: Array<{
      id: string;
      question: string;
      type: string;
      maxScore: number;
      answers: Array<{
        id: string;
        text: string;
      }>;
    }>;
  };
}

export function QuizForm({ quiz }: QuizFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<
    Record<
      string,
      { answerId?: string; answerIds?: string[]; writtenAnswer?: string }
    >
  >({});
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all questions are answered
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    startTransition(async () => {
      try {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          ...answer,
        }));

        const result = await submitQuizAttempt(quiz.id, answersArray);
        setResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit quiz");
      }
    });
  };

  const handleAnswerChange = (
    questionId: string,
    value: { answerId?: string; answerIds?: string[]; writtenAnswer?: string }
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (result) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Your Score</div>
              <div className="text-3xl font-bold text-green-600">
                {result.score.toFixed(1)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Max Score</div>
              <div className="text-3xl font-bold">{result.maxScore.toFixed(1)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Percentage</div>
              <div className="text-3xl font-bold text-blue-600">
                {result.percentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => router.push("/quizzes")} className="flex-1">
              Back to Quizzes
            </Button>
            <Button
              onClick={() => router.push(`/quizzes/${quiz.id}/attempts`)}
              variant="outline"
            >
              View All Attempts
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {quiz.questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Question {index + 1} ({question.maxScore} point{question.maxScore !== 1 ? "s" : ""})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base">{question.question}</p>

            {question.type === "MULTIPLE_CHOICE" && (
              <RadioGroup
                value={answers[question.id]?.answerId || ""}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, { answerId: value })
                }
              >
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <Label htmlFor={answer.id} className="cursor-pointer">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "TRUE_FALSE" && (
              <RadioGroup
                value={answers[question.id]?.answerId || ""}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, { answerId: value })
                }
              >
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <Label htmlFor={answer.id} className="cursor-pointer">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "MULTI_SELECT" && (
              <div className="space-y-2">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={answer.id}
                      checked={(answers[question.id]?.answerIds || []).includes(
                        answer.id
                      )}
                      onCheckedChange={(checked) => {
                        const currentIds = answers[question.id]?.answerIds || [];
                        const newIds = checked
                          ? [...currentIds, answer.id]
                          : currentIds.filter((id) => id !== answer.id);
                        handleAnswerChange(question.id, { answerIds: newIds });
                      }}
                    />
                    <Label htmlFor={answer.id} className="cursor-pointer">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "COMPLETE" && (
              <Input
                placeholder="Your answer..."
                value={answers[question.id]?.writtenAnswer || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, {
                    writtenAnswer: e.target.value,
                  })
                }
              />
            )}

            {question.type === "WRITTEN" && (
              <Textarea
                placeholder="Write your answer here..."
                value={answers[question.id]?.writtenAnswer || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, {
                    writtenAnswer: e.target.value,
                  })
                }
                rows={4}
              />
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/quizzes")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Quiz
        </Button>
      </div>
    </form>
  );
}