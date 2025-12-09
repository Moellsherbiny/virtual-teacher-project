import prisma from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userId = params.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "no user id found" }, { status: 400 });
  }

  const myCourses = await prisma.course.findMany({
    where: { enrollments: { some: { userId } } },
  });

  return NextResponse.json({ courses: myCourses });
}
