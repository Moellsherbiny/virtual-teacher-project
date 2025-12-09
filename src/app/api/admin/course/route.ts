import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/prisma";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "STUDENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await prisma.course.findMany({
    where: {
      instructorId: session.user.id,
    },
    select:{
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      instructor: {
        select: {
          name: true,
          email: true,
        },
      },
      modules: true,
      enrollments: true
    }
  });

  return NextResponse.json({ courses });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "STUDENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, imageUrl } = await request.json();

  if (!title || !description ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      imageUrl,
      instructorId: session.user.id,
    },
  });

  return NextResponse.json(
    { course, message: "Course created successfully" },
    { status: 201 }
  );
}
