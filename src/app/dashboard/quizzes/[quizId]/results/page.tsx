import { getQuizAttempts } from "@/actions/admin-quiz-actions";

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const res = await getQuizAttempts(quizId);

  if (res?.error) {
    return <div className="p-6">{res.error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quiz Results</h1>

      {res.attempts &&
       res.attempts.map((attempt) => (
        <div key={attempt.id} className="border p-4 rounded-md">
          <p className="font-medium">
            {attempt.user.name} – {attempt.score ?? "Not graded"}
          </p>

          <p className="text-xs text-muted-foreground">
            {new Date(attempt.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
