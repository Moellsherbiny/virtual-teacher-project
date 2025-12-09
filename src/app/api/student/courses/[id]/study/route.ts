import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import  prisma  from "@/lib/database/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const courseId = (await params).id;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course." },
        { status: 403 }
      );
    }

    // Fetch full course data for study
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                type: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching study data:", error);
    return NextResponse.json(
      { error: "Failed to fetch study data" },
      { status: 500 }
    );
  }
}