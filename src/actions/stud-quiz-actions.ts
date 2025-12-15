"use server";

import prisma  from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Get available quizzes for a student
export async function getAvailableQuizzes() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
      attempts: {
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return quizzes;
}

// Get a single quiz with questions
export async function getQuizById(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Hide correct answers from students
  const sanitizedQuiz = {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      ...q,
      correctText: undefined,
      answers: q.answers.map((a) => ({
        id: a.id,
        text: a.text,
      })),
    })),
  };

  return sanitizedQuiz;
}

// Submit quiz attempt
export async function submitQuizAttempt(
  quizId: string,
  answers: Array<{
    questionId: string;
    answerId?: string;
    answerIds?: string[];
    writtenAnswer?: string;
  }>
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Fetch quiz with questions and correct answers
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Calculate score
  let totalScore = 0;
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.maxScore, 0);

  const answerData = answers.map((answer) => {
    const question = quiz.questions.find((q) => q.id === answer.questionId);
    if (!question) return null;

    let isCorrect = false;
    let questionScore = 0;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
      case "TRUE_FALSE":
        const correctAnswer = question.answers.find((a) => a.isCorrect);
        if (correctAnswer && answer.answerId === correctAnswer.id) {
          isCorrect = true;
          questionScore = question.maxScore;
        }
        break;

      case "MULTI_SELECT":
        const correctAnswerIds = question.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.id)
          .sort();
        const userAnswerIds = (answer.answerIds || []).sort();
        if (
          correctAnswerIds.length === userAnswerIds.length &&
          correctAnswerIds.every((id, idx) => id === userAnswerIds[idx])
        ) {
          isCorrect = true;
          questionScore = question.maxScore;
        }
        break;

      case "COMPLETE":
      case "WRITTEN":
        if (
          question.correctText &&
          answer.writtenAnswer?.trim().toLowerCase() ===
            question.correctText.trim().toLowerCase()
        ) {
          isCorrect = true;
          questionScore = question.maxScore;
        }
        break;
    }

    totalScore += questionScore;

    return {
      questionId: answer.questionId,
      answerId: answer.answerId || null,
      writtenAnswer: answer.writtenAnswer || null,
      isCorrect,
      score: questionScore,
    };
  });

  // Create attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score: totalScore,
      answers: {
        create: answerData
          .filter((a) => a !== null)
          .map((a) => ({
            questionId: a!.questionId,
            answerId: a!.answerId,
            writtenAnswer: a!.writtenAnswer,
          })),
      },
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
          answer: true,
        },
      },
    },
  });

  revalidatePath("/quizzes");
  revalidatePath(`/quizzes/${quizId}`);

  return {
    attemptId: attempt.id,
    score: totalScore,
    maxScore,
    percentage: (totalScore / maxScore) * 100,
  };
}

// Get student's quiz attempts
export async function getQuizAttempts(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: session.user.id,
      quizId,
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
          answer: true,
        },
      },
      quiz: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return attempts;
}

// Get attempt details
export async function getAttemptDetails(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      id: attemptId,
      userId: session.user.id,
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
          answer: true,
        },
      },
      quiz: {
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  return attempt;
}