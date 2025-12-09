import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";


interface Params {
  params: Promise<{courseId: string}>;
}

export async function DELETE(
  req: NextRequest,{ params }: Params
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {courseId} = await params;

  try {
    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course", details: error },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, imageUrl } = body;

  try {
    const updated = await prisma.course.update({
      where: { id: (await params).courseId },
      data: {
        title,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: NextRequest,
  { params }: Params
) {

  const {courseId} = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: true,
      modules: true,
      enrollments: true,
    },
  });

  return NextResponse.json(course);
}
