import prisma from "@/lib/database/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      {
        error: "no user id found",
      },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          course: { select: { id: true, title: true } },
          lesson: { select: { id: true, title: true } },
        },
      },
      answers: {
        include: {
          question: {
            select: { id: true, question: true, type: true, maxScore: true },
          },
          answer: { select: { id: true, text: true, isCorrect: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ attempts });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
