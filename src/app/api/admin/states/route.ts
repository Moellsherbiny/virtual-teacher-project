import { auth } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const studentsCount = await prisma.user.count({where:{role:"STUDENT"}})
  const coursesCount = await prisma.course.count()
  const quizzesCount = await prisma.quiz.count()
  const convCount = await prisma.chatConversation.count()

  return NextResponse.json({ studentsCount , coursesCount, quizzesCount, convCount});
}
