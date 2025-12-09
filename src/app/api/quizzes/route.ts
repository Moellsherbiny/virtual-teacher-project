import prisma from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "no user id found" }, { status: 400 });
    }

    const userId = session.user.id;
    const quizzes = await prisma.quiz.findMany({
      where: {
        course: {
          enrollments: { some: { userId } },
        },
      },
      include: {
        course: { select: { id: true, title: true } },
        questions: { select: { id: true, question: true, type: true } },
      },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
