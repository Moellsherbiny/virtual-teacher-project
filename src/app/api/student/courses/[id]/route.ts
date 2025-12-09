
import { NextRequest, NextResponse } from 'next/server';
import  prisma from '@/lib/database/prisma';

interface Params {
  params: Promise<{ id: string }>;
}


// GET single course with all modules and lessons
export async function GET(
  request: NextRequest,
  { params }: Params
) {
    const { id } = await params;
    try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') // Optional: to check enrollment status

    const course = await prisma.course.findUnique({
      where: { id },
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
            lessons: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        enrollments: userId ? {
          where: {
            userId: userId,
          },
          select: {
            id: true,
            createdAt: true,
          },
        } : false,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Add isEnrolled flag if userId provided
    const courseWithEnrollment = {
      ...course,
      isEnrolled: userId ? (course.enrollments && course.enrollments.length > 0) : undefined,
      enrollments: undefined, // Remove enrollments array from response
    }

    return NextResponse.json(courseWithEnrollment)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}