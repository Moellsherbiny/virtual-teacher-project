import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";


type Params ={
  params: Promise<{courseId: string}>;
}
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: { id: true, name: true },
        },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        enrollments: userId
          ? { where: { userId } }
          : false, // only check enrollment if logged in
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    const isEnrolled =
      Array.isArray(course.enrollments) &&
      course.enrollments.length > 0;

    return NextResponse.json({
      ...course,
      isEnrolled,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}