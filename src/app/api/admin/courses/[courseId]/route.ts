// ==========================================
// COURSES ENDPOINTS
// ==========================================

// app/api/admin/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/database/prisma';

interface Params {
  params: Promise<{ courseId: string }>;
}

// GET single course
export async function GET(
  request: NextRequest,
  { params }: Params 
) {
  try {
    const { courseId } = await params;
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId},
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// UPDATE course
export async function PATCH(
  request: NextRequest,
  { params }: Params 
) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, instructorId } = body;
    const { courseId } = await params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId},
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update course
    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(instructorId && { instructorId }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { courseId } = await params;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // ============================
    // 1. QUIZ ATTEMPT ANSWERS
    // ============================

    await prisma.quizAttemptAnswer.deleteMany({
      where: {
        attempt: { quiz: { courseId } }
      }
    });

    // ============================
    // 2. QUIZ ATTEMPTS
    // ============================

    await prisma.quizAttempt.deleteMany({
      where: {
        quiz: { courseId }
      }
    });

    // ============================
    // 3. QUIZ ANSWERS + QUESTIONS
    // ============================

    await prisma.quizAnswer.deleteMany({
      where: {
        question: { quiz: { courseId } }
      }
    });

    await prisma.quizAttemptAnswer.deleteMany({
      where: {
        question: { quiz: { courseId } }
      }
    });

    await prisma.quizQuestion.deleteMany({
      where: {
        quiz: { courseId }
      }
    });

    // ============================
    // 4. QUIZZES (course + lesson)
    // ============================

    await prisma.quiz.deleteMany({
      where: { courseId }
    });

    await prisma.quiz.deleteMany({
      where: { lesson: { module: { courseId } } }
    });

    // ============================
    // 5. CHAT CONVERSATIONS
    // ============================

    await prisma.chatConversation.deleteMany({
      where: { courseId }
    });

    await prisma.chatConversation.deleteMany({
      where: { lesson: { module: { courseId } } }
    });

    // ============================
    // 6. LESSONS
    // ============================

    await prisma.lesson.deleteMany({
      where: { module: { courseId } }
    });

    // ============================
    // 7. MODULES
    // ============================

    await prisma.module.deleteMany({
      where: { courseId }
    });

    // ============================
    // 8. ENROLLMENTS
    // ============================

    await prisma.enrollment.deleteMany({
      where: { courseId }
    });

    // ============================
    // 9. DELETE THE COURSE
    // ============================

    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json({
      success: true,
      message: "Course and all related data deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
