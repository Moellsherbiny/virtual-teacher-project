import { NextRequest, NextResponse } from 'next/server';


type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
};

type Quiz = {
  quiz: {
    questions: Question[];
  };
};

function generateFeedback(score: number, total: number): string {
  const percentage = (score / total) * 100;

  if (percentage === 100) {
    return 'ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح.';
  } else if (percentage >= 80) {
    return 'عمل رائع! لقد أجبت على معظم الأسئلة بشكل صحيح.';
  } else if (percentage >= 50) {
    return 'أداء جيد. يمكنك تحسين إجاباتك في المستقبل.';
  } else {
    return 'لا بأس، يمكنك المحاولة مرة أخرى لتحسين نتائجك.';
  }
}

export default async function POST(req: NextRequest) {
  const { id,generatedQuiz, selectedAnswers } = await req.json();

  if (!id || !selectedAnswers) {
    return NextResponse.json({ message: 'Invalid request payload' });
  }



  let score = 0;

  generatedQuiz.questions.map((question, index) => {
    if (selectedAnswers[index] === question.quiz.questions) {
      score += 1;
    }
  });

  const feedback = generateFeedback(score, quiz.questions.length);

  return NextResponse.json({
    feedback,
    results: quiz.questions.map((question, index) => ({
      question: question.text,
      correctAnswer: question.correctAnswer,
      selectedAnswer: selectedAnswers[index],
    })),
  });
}
