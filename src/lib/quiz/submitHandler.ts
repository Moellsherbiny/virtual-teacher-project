type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
};

type Quiz = {
  questions: Question[];
};

export function submitHandler(quiz: Quiz, studentAnswers: string[]): number {
  let score = 0;

  for (let i = 0; i < studentAnswers.length; i++) {
    if (quiz.questions[i].correctAnswer === studentAnswers[i]) {
      score++;
    }
  }

  return score;
}

export function generateFeedback(score: number, total: number): string {
  const percentage = (score / total) * 100;

  if (percentage === 100) {
    return "ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح.";
  } else if (percentage >= 80 && percentage < 100) {
    return "عمل رائع! لقد أجبت على معظم الأسئلة بشكل صحيح.";
  } else if (percentage >= 50 && percentage < 80) {
    return "أداء جيد. يمكنك تحسين إجاباتك في المستقبل.";
  } else if (percentage >= 0 && percentage < 50) {
    return "لا بأس، يمكنك المحاولة مرة أخرى لتحسين نتائجك.";
  } else {
    return "القيمة غير صالحة للنسبة المئوية.";
  }
}
