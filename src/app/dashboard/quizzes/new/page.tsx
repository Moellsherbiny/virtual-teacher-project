import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuizCreateForm from "@/components/dashboard/quiz/QuizCreateForm"

export default function NewQuizPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Create New Quiz
          </CardTitle>
        </CardHeader>

        <CardContent>
          <QuizCreateForm />
        </CardContent>
      </Card>
    </div>
  )
}
