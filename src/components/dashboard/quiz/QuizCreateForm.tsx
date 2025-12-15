"use client"

import { createQuiz } from "@/actions/admin-quiz-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function QuizCreateForm() {
  return (
    <form action={createQuiz} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Midterm Quiz"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional description for the quiz"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseId">Course ID</Label>
          <Input
            id="courseId"
            name="courseId"
            placeholder="optional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lessonId">Lesson ID</Label>
          <Input
            id="lessonId"
            name="lessonId"
            placeholder="optional"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Quiz
      </Button>
    </form>
  )
}
