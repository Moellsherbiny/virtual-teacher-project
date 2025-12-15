// types/quiz.ts

export enum QuestionType {
  TRUE_FALSE = "TRUE_FALSE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTI_SELECT = "MULTI_SELECT",
  COMPLETE = "COMPLETE",
  WRITTEN = "WRITTEN",
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  courseId: string | null;
  lessonId: string | null;
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  course?: {
    id: string;
    title: string;
  } | null;
  lesson?: {
    id: string;
    title: string;
  } | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  maxScore: number;
  correctText: string | null;
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number | null;
  createdAt: Date;
  answers: QuizAttemptAnswer[];
  quiz?: {
    title: string;
  };
}

export interface QuizAttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answerId: string | null;
  writtenAnswer: string | null;
  question?: QuizQuestion;
  answer?: QuizAnswer;
}

export interface QuizSubmission {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  writtenAnswer?: string;
}

export interface QuizResult {
  attemptId: string;
  score: number;
  maxScore: number;
  percentage: number;
}